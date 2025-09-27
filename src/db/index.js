import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
      const connectInstance = await mongoose.connect(`mongodb+srv://sujalghodeswar967:Mytube123@sgtube.8ikidhg.mongodb.net/${DB_NAME}`);
       console.log(`Database Connected , HOST : ${connectInstance.connection.host}`)
        
    } catch (error) {
        console.error("ERROR : ",error)
        process.exit(1)
    }
}

export default connectDB