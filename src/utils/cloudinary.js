import {v2 as clodinary} from "cloudinary" ; 
import { response } from "express";
import fs from "fs"  ; 


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET
});


const uploadOnCloudianary  = async (localFilePath) => {
  try {
    if (!localFilePath) return null ; 
    const response  = await clodinary.uploader.upload(localFilePath , {
      resource_type : "auto"
    })
    console.log("file uploaded sucessfully " ,  response.url)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    
  }
  
}

export {uploadOnCloudianary}