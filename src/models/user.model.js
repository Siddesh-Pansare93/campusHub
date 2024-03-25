import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt" ; 


const userSchema  = new mongoose.Schema({
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
        type : String  , 
        required : [true , "Password can't be empty "]
    } ,
    profilePicture : {
        type : String  ,   // cloudinary url
        required :true 
    } ,
    refreshToken : {
        type : String  
    } , 
    tweets : {
        type: mongoose.Schema.Types.ObjectId  ,
        ref : "Post" 
        
    }
} ,{timestamps:true})

// encrpting password beforing save it in Db
userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password , 10)
    next()
})

// checking if password matches with one that in DB .. (if user tries to logIN)
userSchema.methods.idPasswordCorrect = async function(password){
    return bcrypt.compare(password , this.password)
}

// generating jwt ( access and refresh ) Tokens 

userSchema.methods.generateAccessTokens = function(){
    return jwt.sign(
        {
            _id:this._id , 
            username : this.username ,
            email  : this.email
        } ,
        process.env.ACCESS_TOKEN_SECRET , 
        {
           expiresIn :  process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshTokens = function(){
    return jwt.sign(
        {
            _id:this._id , 
            
        } ,
        process.env.REFRESH_TOKEN_SECRET , 
        {
           expiresIn :  process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)
