import mongoose , {Schema} from "mongoose";

const userSchema  = new Schema({
    name : {
        type : String , 
        required : true
    } , 
    username  :{
        type : String , 
        required : [true , "username is required"] ,
        unique : [true , "Username is already taken"] , 
        trim : true  
    } , 
    email : {
        type : String , 
        required : true ,
        lowercase : true  ,
        trim : true  ,
        unique : [true  , "Already registered with this email"]
    } , 
    password : {
        type : true  , 
        required : [true , "Password can't be empty "]
    } ,
    profilePicture : {
        type : String  ,   // cloudinary url
        required :true 
    } ,
    refreshToken : {
        type : String  , 
        required : true 
    } , 
    tweets : {
        type: mongoose.Schema.Types.ObjectId  ,
        ref : Post 
        
    }
} ,{timestamps:true})

export const User = mongoose.model("User" , userSchema)