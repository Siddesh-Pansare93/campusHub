import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const verifyJWT = asyncHandler(async( req ,res ,next ) => {
    try {
        console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("token is : " ,token)
        if (!token) {
            
            throw new ApiError ( 400 , "Unauthorized Request" )
        }
    
        const decodedToken = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET ) 
        console.log("decodedToken is " , decodedToken)
    
    
        const user = await User.findById(decodedToken?._id).select(
            " -password -refreshToken "
        )
        console.log(user)
    
        if (!user) {
            throw new ApiError( 401  , "Invalid Access Tokens" ) 
        }

        req.user = user ; 
        next()

    } catch (error) {
        throw new ApiError( 401 , error?.message || "Invalid Access Tokens" )
    }

    
})