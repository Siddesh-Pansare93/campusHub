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
   await  user.save({ validateBeforeSave : true }) 

    return { accessToken , refreshToken }
}



const registerUser = asyncHandler(async (req ,res , next) => {
    //req.body 
    //check all fields are there
    //check if user already exists 
    //takes profile picture from user 
    //upload it on cloudinary 
    // create user in DB
    //check if the user is created successfully 
    //return res to user 

    const { name , username , email , password } = req.body
    console.log(req.body)
    console.log(req.files)
    console.log(name  , username  , email )
    

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

    // const profilePictureLocalPath = req.files?.profilePicture[0]?.path ; 
    

    let profilePictureLocalPath ; 
    if(req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0){
        profilePictureLocalPath  = req.files.profilePicture[0].path ;
    }

    console.log(profilePictureLocalPath);
    
    const profilePicture = await uploadOnCloudianary(profilePictureLocalPath) ;

     


    const user = await User.create(
        {
            name , 
            username : username.toLowerCase(), 
            profilePicture : profilePicture?.url || "" , 
            password  , 
            email 
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshTokens")
        console.log(createdUser)
    if (!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering User")
    }


    return res.status(201)
    .render("login.ejs" , {createdUser})
    .json(
        new ApiResponse(200 , createdUser , "User Registered Sucessfully")
    )
    

})

const loginUser = asyncHandler(async (req , res ) => {

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
    console.log("refreshToken is  : " , refreshToken)
    const loggedInuser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
        const options  = {
            httpOnly : true, 
            secure : true
        }
    // res.render("home.ejs")
    return res
    .status(200)
    .cookie( "accessToken" ,accessToken ,options )
    .cookie( "refreshToken" , refreshToken  ,options )
    .render("home.ejs" , { loggedInuser })
    .json(
        new ApiResponse (
            200 , loggedInuser  , "User Logged In Succesfully"
        )
    )
    // .render("logout.ejs")
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
    .render("Aboutus.ejs")
    .json(
        new ApiResponse( 
            200 , "" , "User Logged Out"
        )
    )
})

const refreshAccessToken = asyncHandler( async ( req , res ) => {
    try {
        const incomingRefreshToken  = req.cookies?.refreshToken  || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError (401 , "Invalid Refresh Token")
        }

        const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

        const user  = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError (401 , "Invalid Refresh Token")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError("Invalid Refresh Token")
        }

        const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly : true , 
            secure : true 
        }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , newRefreshToken , options)
    .json(
        new ApiResponse (
            200 , 
            {
                accessToken ,refreshToken : newRefreshToken
            } , 
            "Access Token refreshed Successfully "
        )
    )

    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid Refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async (req ,res) => {

    const {oldPassword  , newPassword }  = req.body

    const user = await User.findById(req.user?._id)
    console.log(user)
    

    const isPasswordCorrect = await user.idPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError (400 ,  "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .render("home.ejs")
    .json(
        new ApiResponse (200 , {} , "Password Changed Successfully")
    )

} )

const getCurrentUser = asyncHandler(async(req, res) => {
    return  res
    .status(200)
    .json(
        new ApiResponse (200 , req.user , "Current user fetched Succes")
    )
})

const updateAccountDetails = asyncHandler(async(req , res )=> {

    const {username , email } = req.body 

    if(!username || !email){
        throw new ApiError(400 , "All fields required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
            $set : {
                fullName , 
                email ,
            }
        } , 
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse (
            200 , user , "Account details updated succesfully"
        )
    )

})

const updateProfilePicture  = asyncHandler(async(req , res ) => {
    const profilePictureLocalPath = req.file?.path

    if(!profilePictureLocalPath){
        throw new ApiError(400 , "Avatar file is missing ")
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath)

    if (!profilePicture.url) {
        throw new ApiError(400 , "Error while uploading Profile Picture ")
    }

    User.findByIdAndUpdate(
        req.user?._id ,
        {
           $set : {
                avatar  : coverImage.url
            }
        } , 
        {new  : true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,user, "Profile Picture updated Succesfully")
    )

})

const createPost = asyncHandler(async(req ,res)=>{
    const user = req.user?._id
    console.log(user);
})

export {
    registerUser , 
    loginUser,
    logoutUser ,
    refreshAccessToken ,
    changeCurrentPassword ,
    getCurrentUser ,
    updateAccountDetails ,
    updateProfilePicture 
 }