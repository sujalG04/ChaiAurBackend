# chai aur code backend project

# Backend setup configuration - itna to hona hi chahiye
// db 
// models
// multer.middleware.js
// AsyncHandler.js
// cloudinary.js
// constant.js

// app.js

import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();

// middlewares 
app.use(cors({
    origin: process.env.CORS_ORIGIN , // for which url grant access to fetch data from here 
    Credential : true
}))
 //to handle json type data
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended: true , limit:'16kb'}))
app.use(express.static('public'))

// use to handle data at users browser : cookies
app.use(cookieParser())

export {app} 