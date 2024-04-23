import express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors" ; 
import path from "path";


const app = express()


//configurations 

app.use(cors({
    origin : process.env.CORS_ORIGIN , 
    credentials : true 
}))


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"));
app.set("View engine" ,"ejs")
// app.set("views" , path.join(__dirname , "/views")); 

app.use((err , req , res , next ) => {
    res.send("Something went wrong")
})



app.use(cookieParser())


// importing routes
import userRouter from "./routes/user.route.js"
import tweetRouter from "./routes/tweet.route.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";



//declare routes

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/tweets", tweetRouter)



// app.use(errorHandler)


export {app} ;  