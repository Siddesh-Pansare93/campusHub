import { asyncHandler } from "../utils/asyncHandler.js";





const registerForm  =  (req , res) => {
    res.render("register.ejs")
}
const loginForm  =  (req , res) => {
    res.render("login.ejs")
}

const changepasswordForm = (req ,res ) => {
    res.render("cp.ejs")
}

const tweetForm = (req , res) =>{
    res.render("tweet.ejs")
}

export {registerForm , loginForm , changepasswordForm , tweetForm}