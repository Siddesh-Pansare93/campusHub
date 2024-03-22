import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


const connectDb = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODBURI}/${DB_NAME}`)
       console.log(`MongoDb connected !!! ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDb connection Failed :  ${error}`)
    }
}

export default connectDb ;
