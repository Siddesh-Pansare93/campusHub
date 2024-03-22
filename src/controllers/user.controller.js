import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js" ; 
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudianary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req ,res) => {
    
    console.log(req.body)
    const { name , username , email , password } = req.body
    console.log(email ,username , name , password)

    if ([username , email  , password ].some((field)=> fields?.trim()=== "")
        ) {
        throw new ApiError(400 ,  "All fields are required")  ; 
    }
    
    const existedUser = await User.findOne({
        $or : ["username" , "email"]
    })

    if (existedUser) {
        throw new ApiError(409 , "User ALready exists")
    }

    const profilePictureLocalPath = req.files?.[0]?.path ; 

    if (!profilePictureLocalPath) {
        throw new ApiError (400 , "profile picture required")
    }
    
    const profilePicture = await uploadOnCloudianary(profilePictureLocalPath) ; 

    await User.create(
        {
            name , 
            username : username.toLowercase(), 
            profilePicture : profilePicture.url , 
            password 
        }
    )

    const createdUser = await User.findById(User._id).select("-password -refreshTokens")

    if (!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering User")
    }
    
    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Sucessfully")
    )
})


export {registerUser }