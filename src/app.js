import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();

// middlewares 
app.use(cors({
    origin: process.env.CORS_ORIGIN , // for which url grant access to fetch data from here 
    Credential : true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended: true , limit:'16kb'}))
app.use(express.static('public'))

// use to handle data at users browser : cookies
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'


// routes declaration
app.use("/api/v1/user" , userRouter)

export {app} 