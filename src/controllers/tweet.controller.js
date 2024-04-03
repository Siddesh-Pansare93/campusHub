import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const createTweet = asyncHandler(async (req, res) => {
    const {tweetcontent} = req.body

    if(!tweetcontent){
        throw new ApiError(400,"tweetContent is needed");
    }
   const tweetCreated =  await Tweet.create({
        owner:req.user?._id,
        content:tweetcontent,
    })
 
    if(!tweetCreated){
        throw new ApiError(400,"tweet created problem")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            tweetCreated,
            "tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {

    const {userId} = req.params;

    if(!userId ){
        throw new ApiError(400,"for user tweets id is required")
    }

   const tweet =  await User.findById(userId);
   if(!tweet || !(tweet.owner.toString() == req.user._id.toString())){
    throw new ApiError(400,"user doesnot found")
   }

  const userTweets =  await Tweet.aggregate([
    {
        $match:{
            owner:new mongoose.Types.ObjectId (userId)
            
        }
    },

    {
        $project:{
            content:1
        }
    }
   ])

   if(!userTweets){
    throw new ApiError(400,"user tweets not existed")
   }

   return res.status(200).json(
    new ApiResponse(
        200,
        userTweets,
        "user tweets"
    )
   )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {tweetData} = req.body;

    if(!tweetId){
        throw new ApiError(200,"tweetID doesnot exist")
    }

    if(!tweetData ){
        throw new ApiError(200,"tweetdata doesnot exist")
    }

   const tweetFound =  await Tweet.findById(tweetId)
   if(!tweetFound){
    throw new ApiError(400,"tweet not found")
   }

   if(!(tweetFound.owner.toString() === req.user?._id.toString())){
    throw new ApiError(400,"user is not logined by smae id")
   }

   
try {
    
      const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:tweetData,
            }
        },
        {new :true}
       )
    
       if(!updatedTweet){
        throw new ApiError(400,"probem in updation of tweet")
       }
    
       return res.status(200).json(
           new ApiResponse(
            200,
            updatedTweet,
            "tweet updated successfuully"
           )
    
       )
} catch (error) {
    throw new ApiError(401, error.message ||"cannot update tweet")
}
   

})

const deleteTweet = asyncHandler(async (req, res) => {

    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(400,"tweet id not found")
    }

    const tweetFound = await Tweet.findById(tweetId)
    if(!tweetFound){
        throw new ApiError(400,"tweet does not exitsed")
    }

    if(!(tweetFound.owner.toString() === req.user?._id.toString()))
    {
        throw new ApiError(400,"user should be loggined with same id")
    }
try {
    
        const tweetDeleted = await Tweet.findByIdAndDelete(
            {_id:tweetId},
            {new:true}
        )
        if(!tweetDeleted){
            throw new ApiError(400,"there is a problem while deleting the tweet")
        }
    
        return res.status(200).json(
            new ApiResponse(
                200,
                "tweet successfully deleted"
            )
        )
} catch (error) {
    throw new ApiError(401,error?.message || "tweet cannot be deleted")
}
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}