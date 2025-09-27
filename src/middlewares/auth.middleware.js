import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { AsyncHandler } from "../utils/AsyncHandler";
import jwt  from "jsonwebtoken"


export const verifyJWT = AsyncHandler(async(req , res , next)=>{
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