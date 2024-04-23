import mongoose from 'mongoose'

const landingPage = (req ,res ) => {
    res.render("Aboutus.ejs")
}

const contentPolicy = (req, res ) => {
    res.render("contentpolicy.ejs")
}
const privacyPolicy = (req, res ) => {
    res.render("Privacy.ejs")
}



export {
    landingPage,
    contentPolicy, 
    privacyPolicy
}