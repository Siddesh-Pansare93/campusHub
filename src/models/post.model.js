import mongoose from "mongoose";


// const commentSchema = new mongoose.Schema({
//     content : {
//         type : String  , 
//         required : true 
//     } , 
//     likes : {
//         type : Number , 
//         required  :true , 
//         default  :0 
//     }
// } , {timeStamps : true})

const postSchema = new mongoose.Schema({
    content : {
        type : String ,
        required :true 
    } , 
    username : { 
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User"
    } , 
    upVotes :  {
        type : Number , 
        required : true ,
        default :  0
    } , 
    downVotes :  {
        type : Number , 
        required : true ,
        default :  0
    } , 
    // comments : [commentSchema] , 


} , {timestamps : true})

export const Post = mongoose.model("Post" , postSchema)