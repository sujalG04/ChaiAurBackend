import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt  from "jsonwebtoken"

// if req , res is not in use you can add _ instead them
export const verifyJWT = AsyncHandler(async(req , _ , next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")

    if(!token){
        throw new ApiError(401 , "Unauthorized user")
    }

    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401 , "Invalid Access Token")
    }
    
    // created new object inside req 
    req.user = user
    next()
    } catch (error) {
        throw new ApiError(400 , error?.message || "Invalid Access Token")
    }
})