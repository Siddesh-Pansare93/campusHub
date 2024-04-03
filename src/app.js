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


app.use(cookieParser())


// importing routes
import userRouter from "./routes/user.route.js"



//declare routes

app.use("/api/v1/users" , userRouter)

export {app} ;  