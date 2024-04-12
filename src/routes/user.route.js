import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken , changeCurrentPassword } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginForm, registerForm  , changepasswordForm} from "../controllers/form.controller.js";
import { contentPolicy, landingPage } from "../controllers/page.controllers.js";

const router = Router() ; 

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


// secured Routes 

router.route("/logout").get(
    verifyJWT , logoutUser
)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post( verifyJWT ,changeCurrentPassword)
router.route("/change-password").get( verifyJWT ,changepasswordForm)
router.route("/update-details").post(verifyJWT , )



router.route("/contentPolicy").get(contentPolicy)

export default router 
