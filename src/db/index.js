import mongoose from "mongoose";
import {DB_NAME} from "../constants"


const connectDb = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODBURI}/${DB_NAME}`)
       console.log(`MongoDb connected !!! ${connectionInstance.connection.HOST}`)
        
    } catch (error) {
        console.log(`MongoDb connection Failed :  ${error}`)
    }
}

export default connectDb ;
