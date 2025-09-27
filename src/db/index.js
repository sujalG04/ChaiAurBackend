import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
      const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
       console.log(`Database Connected , HOST : ${connectInstance.connection.host}`)
        
    } catch (error) {
        console.error("ERROR : ",error)
        process.exit(1)
    }
}

export default connectDB