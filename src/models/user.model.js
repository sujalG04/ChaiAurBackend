import mongoose , {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = mongoose.Schema({
    username:{
        type : String ,
        required : true,
        unique : true,
        lowercase : true,
        trim : true ,
        // it is used to optimize searching operation but lower the performance hence use only when you sure that this field is use frequently to search
        index : true
    },
    email :{
        type : String ,
        required : true,
        unique : true,
        lowercase : true,
        trim : true ,
    },
    fullname :{
        type : String ,
        required : true,
        trim : true ,
    },
    avatar :{
        type : String , // cloudinary api
        required : true,
    },
    coverImage :{
        type : String ,
    },
    watchHistory : // its an Array
    [{   //its a syntax for foreign key
        type: Schema.Types.ObjectId ,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true, "password is missing !"]
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

// middleware used to perfom operation on data before save it 
// save 
// remove
// updateOne
// deleteOne

// in save this refers to Schema
userSchema.pre("save" , async function (next){
    if(! this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 10);
    next()
})

// methods allow us to create our own custom methods 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = async function (){
   return await jwt.sign(
        {
          _id : this._id,
          email:this.email,
          username:this.username,
          fullname:this.fullname
       },
       process.env.ACCESS_TOKEN_SECRET ,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
)
}
userSchema.methods.generateRefreshToken = async function (){
   return await jwt.sign(
        {
          _id : this._id,
          
       },
       process.env.REFRESH_TOKEN_SECRET ,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
)
}

export const User = mongoose.model("User" , userSchema);