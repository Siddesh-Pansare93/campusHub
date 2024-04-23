import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const createTweet = asyncHandler(async (req, res) => {
    const { headline , content} = req.body

    if(!content){
        throw new ApiError(400,"tweetContent is needed");
    }
   const tweetCreated =  await Tweet.create({
        owner:req.user?._id,
        content ,
        headline
    })
 
    if(!tweetCreated){
        throw new ApiError(400,"tweet created problem")
    }

    const tweets = await getAllTweets()
    .then(async (tweets) => {
        const updatedTweetList = []; // Initialize an array to store updated tweets
        for (const tweet of tweets.Alltweet) {
            // Asynchronous function to find user
            const user = await User.findById(tweet.owner).select("-password -refreshToken");
            console.log(user.username); // Logging the user name
            
            // Update the owner of the tweet
            const updatedTweet = {
                tweet,
                owner: user.username
            };
            updatedTweetList.push(updatedTweet); // Push the updated tweet to the array
        }
        console.log(updatedTweetList)
        return updatedTweetList; // Return the array of updated tweets
    });

    return res.status(200)
    .render("home.ejs" , {tweets})
    .json(
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
            owner:new mongoose.Schema.Types.ObjectId(userId)
            
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

const getAllTweets = (async (req , res)=> {
    const Alltweet =  await Tweet.find({})
    
    return { Alltweet }
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet ,
    getAllTweets
}