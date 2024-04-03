import { asyncHandler } from "../utils/asyncHandler.js";





const registerForm  =  (req , res) => {
    res.render("register.ejs")
}
const loginForm  =  (req , res) => {
    res.render("login.ejs")
}

export {registerForm , loginForm}