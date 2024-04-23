import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
; 
import { tweetForm ,updateProfilePictureForm } from '../controllers/form.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { errorHandler } from '../middlewares/errorHandler.middleware.js';

const router = Router();    
router.use( verifyJWT , errorHandler ); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post( createTweet );
router.route("/create").get( tweetForm );
router.route("/createPost").get( updateProfilePictureForm )
 

router.route("/user/:userId").get( getUserTweets );
router.route("/:tweetId").patch(updateTweet).delete( deleteTweet );



router.route("/alltweets").get(getAllTweets)






export default router