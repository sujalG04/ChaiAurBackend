// require("dotenv").config({path : './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js';
dotenv.config({path:'./.env'})


// when you call async method like connectDB() it returns a promise means you can use then and catch

connectDB()
.then(()=>{
   app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`App running on PORT : ${process.env.PORT}`);
   })
})
.catch((err)=>{
    console.log('MONGODB connection failed ! Error : ', err);
})