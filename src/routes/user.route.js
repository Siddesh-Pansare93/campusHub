import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken , changeCurrentPassword, updateProfilePicture , updateAccountDetails } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginForm, registerForm  , changepasswordForm} from "../controllers/form.controller.js";
import { contentPolicy,  landingPage ,privacyPolicy } from "../controllers/page.controllers.js";
import { errorHandler } from "../middlewares/errorHandler.middleware.js";

const router = Router() ; 
router.use( errorHandler ); // Apply verifyJWT middleware to all routes in this file


router.route("/register").post(
    upload.fields([
        {
            name  : "profilePicture" , 
            maxCount : 1
        }
    ]), registerUser  ) 
    
router.route("/register").get( registerForm )
router.route("/").get(landingPage)
router.route("/login").post( loginUser )
router.route("/login").get( loginForm )

router.route("/home").get((req , res )=>{
    res.render("home.ejs")
})

// secured Routes 

router.route("/logout").get(
    verifyJWT , logoutUser
)

router.route("/refresh-token").post(refreshAccessToken )
router.route("/change-password").post( verifyJWT ,changeCurrentPassword  )
router.route("/change-password").get( verifyJWT ,changepasswordForm )
router.route("/update-details").post(verifyJWT ,updateAccountDetails  )
router.route("/update-profilePicture").post(verifyJWT ,updateProfilePicture  )



router.route("/contentPolicy").get(contentPolicy)
router.route("/privacyPolicy").get(privacyPolicy)

export default router 
