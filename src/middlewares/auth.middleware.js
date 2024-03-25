import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const verifyJWT = asyncHandler(async( req ,res ,next ) => {
    try {
        const token = req.cookies || req.header.Authentication?.replace( "Bearer " , "" )
    
        if (!token) {
            throw new ApiError ( 400 , "Unauthorized Request" )
        }
    
        const decodedToken = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET ) 
        console.log(decodedToken)
    
    
        const user = await User.findById(decodedToken._id).select(
            " -password -refreshToken "
        )
    
        if (!user) {
            throw new ApiError( 401  , "Invalid Access Tokens" ) 
        }
    } catch (error) {
        throw new ApiError( 401 , error?.message || "Invalid Access Token" )
    }

    req.user = user ; 
    next()


})