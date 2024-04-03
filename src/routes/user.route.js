import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken ,createPost } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginForm, registerForm } from "../controllers/form.controller.js";
import { landingPage } from "../controllers/page.controllers.js";

const router = Router() ; 

router.route("/register").post(
    upload.fields([
        {
            name  : "profilePicture" , 
            maxCount : 1
        }
    ]), registerUser  )

router.route("/").get(landingPage)
router.route("/login").post( loginUser )
router.route("/register").get( registerForm )
router.route("/login").get( loginForm )


router.route("/create").post( verifyJWT, createPost)

// secured Routes 

router.route("/logout").post(
    verifyJWT , logoutUser
)

router.route("/refresh-token").post(refreshAccessToken)

export default router 
