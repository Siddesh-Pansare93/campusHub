const errorHandler = ( err ,  req , res , next ) => {
    res.render("404.ejs" , {err})
    // res.send(err)
    
}


export { errorHandler } 