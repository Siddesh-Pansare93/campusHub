import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js" ; 
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudianary } from "../utils/cloudinary.js";



const generateAccessAndRefreshToken  = async( userId ) => {
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessTokens()
    const refreshToken  =  await user.generateRefreshTokens()

    user.refreshToken = refreshToken 
    user.save({ validateBeforeSave : true }) 

    return { accessToken , refreshToken }
}



const registerUser = asyncHandler(async (req ,res) => {
    //req.body 
    //check all fields are there
    //check if user already exists 
    //takes profile picture from user 
    //upload it on cloudinary 
    // create user in DB
    //check if the user is created successfully 
    //return res to user 

    const { name , username , email , password } = req.body
    

    if ([username , email  , password ].some((fields)=> fields?.trim()=== "")
        ) {
        throw new ApiError(400 ,  "All fields are required")  ; 
    }
    
    const existedUser = await User.findOne({
        $or : [{username} , {email}]
    })

    if (existedUser) {
        throw new ApiError(409 , "User ALready exists")
    }

    const profilePictureLocalPath = req.files?.profilePicture[0]?.path ; 
    

    if (!profilePictureLocalPath) {
        throw new ApiError (400 , "profile picture required")
    }
    
    const profilePicture = await uploadOnCloudianary(profilePictureLocalPath) ; 


    const user = await User.create(
        {
            name , 
            username : username.toLowerCase(), 
            profilePicture : profilePicture.url , 
            password  , 
            email 
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    if (!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering User")
    }
    
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Sucessfully")
    )
})

const loginUser = asyncHandler(async () => {

    //req.body 
    // check if the user exists 
    // if yes than check password 
    // refresh and access token 
    // send cookies 

    const { username , email ,  password } = req.body

    if(!(username || email)){
        throw new ApiError (400 , "Username or email required")
    }


    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    if (!user) {
        throw new ApiError (401 , "User does not exist")
    }


    const isPasswordValid = await user.idPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError (404 , "Invalid user credentials")
    }

    const { refreshToken , accessToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInuser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
        const options  = {
            httpOnly : true, 
            secure : true
        }

    res
    .status(200)
    .cookie( "accessToken" ,accessToken ,options )
    .cookie( "refreshToken" , refreshToken  ,options )
    .json(
        new ApiResponse (
            200 , loggedInuser  , "User Logged In Succesfully"
        )
    )
})


const logoutUser = asyncHandler(async( req ,res ) => {
    await User.findByIdAndUpdate(
        req.user._id , 
        {
            $set :{ refreshToken : "" }
        }, 
        {
            new : true 
        }
    )

    const options  = {
        httpOnly : true, 
        secure : true
    }

    res
    .status(200)
    .clearCookie( "accessToken" , options )
    .clearCookie( "refreshToken" , options )
    .json(
        new ApiResponse( 
            200 , "" , "User Logged Out"
        )
    )
})

export {
    registerUser , 
    loginUser,
    logoutUser
 }