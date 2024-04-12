
const landingPage = (req ,res ) => {
    res.render("Aboutus.ejs")
}

const contentPolicy = (req, res ) => {
    res.render("contentpolicy.ejs")
}


export {
    landingPage ,
    contentPolicy
}