import { AsyncHandler } from "../utils/AsyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
   const user = await User.findById(userId)
   const accessToken = await user.generateAccessToken()
   const refreshToken = await user.generateRefreshToken()
   
   user.refreshToken = refreshToken
   user.save({validateBeforeSave : false}) // save without validation 

   return {accessToken , refreshToken}

    } catch (error) {
      throw new ApiError(500 , "something went wrong while generating tokens !")
    }
   
}

const registerUser = AsyncHandler( async (req , res)=>{
   // get user details from frontend
   // validate - not empty
   // check if already exists : username , email
   // check for images , avatar
   // upload them on cloudinary 
   // create user object - create entry in db
   // check for user creation 
   // return response

   const {username , email , fullname , password} = req.body;
   if([username , email , fullname , password].every(
    (field)=> field.trim() === "")){
      throw new ApiError(400 , "All fields are required");
   }
  
  const existedUser = await User.findOne({
    // it checks if user exist with username or email already 
    $or: [{username} , {email}]
   })

   if(existedUser){
    throw new ApiError(409 , "User with username or email already exists !");
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path;
    }

   if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar field is required");
   }
   
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage = "";
  if(coverImageLocalPath){
     coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  

  if(!avatar){
    throw new ApiError(400 , "Avatar field is required");
   }

  const user = await User.create({
    username : username.toLowerCase(),
    email, 
    password,
    fullname,
    avatar: avatar?.url, 
    coverImage: coverImage?.url || ""

   })
  
  const registeredUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // remove password and refreshToken
  // registeredUser.select(
  //   "-password -refreshToken"
  // )

  if(!registeredUser){
     throw new ApiError(500 , "Something went wrong while registering user !!");
  }

  return res.status(201).json(
    new ApiResponse(200 , registeredUser , "User Registered Successfully")
  )

   
})


const loginUser = AsyncHandler(async (req , res)=>{
    // req.body -> username or email , password
    // check username , email  send by user or not
    // check user existed or not
    // check password is correct or not
    // create accessToken and refreshToken
    // return res

    const {username , email , password} = req.body;
    
    if(!username && !email){
      throw new ApiError(400 , "username or email required")
    }

    const user = await User.findOne({
      $or: [{ username } , { email }]
    })

    if(!user){
      throw new ApiError(404 , "user does not exist")
    }

    const isValidate = await user.isPasswordCorrect(password)

    if(!isValidate){
      throw new ApiError(401 , "invalid user credential")
    }

   const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
   // user object does not have refreshtoken hence again 
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   
  //  options are used for , user cannot change cookie data , changes are only from server side 
   const options = {
    httpOnly : true,
    secure : true
   }

   return res.status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken" , refreshToken , options)
   .json(
    new ApiResponse(200 ,
      {
        user : loggedInUser ,
        accessToken ,
        refreshToken
      },
      "User Logged In Successfully"
    )
   )
})


const logoutUser = AsyncHandler(async (req , res)=>{
   await User.findByIdAndUpdate(
    req.user?._id ,
    {
      $set : {
        refreshToken : undefined
      }
    }
   )

   const options = {
    httpOnly : true,
    secure : true
   }
   return res.status(200)
          .clearCookie("accessToken" , options)
          .clearCookie("refreshToken" , options)
          .json(new ApiResponse(200 , {} , "User Logged Out"))
})


const generateAccessToken = AsyncHandler(async (req , res)=>{
   try {
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  // if send by body

    if(!incomingRefreshToken){
      throw new ApiError(401 , "Unauthorized request")
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken ,
      process.env.REFRESH_TOKEN_SECRET
    )

   const user = await User.findById(decodedToken?._id)

   if(!user){
      throw new ApiError(401 , "Invalid Refresh Token")
   }

   if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(401 , "Token is expired or used")
   }

   const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

   const options = {
    httpOnly : true,
    secure : true
   }

   return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
      new ApiResponse(
        200 ,
        {accessToken , refreshToken} ,
        "Access Token Refreshed"
      )
    )
   } catch (error) {
     throw new ApiError(401 , error?.message || "Invalid Refresh Token")
   }
})

export { registerUser ,
         loginUser , 
         logoutUser , 
         generateAccessToken
        }