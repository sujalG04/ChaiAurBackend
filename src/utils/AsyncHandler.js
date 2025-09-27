// this is util function , it is use multiple time thats why we write it once in utils and use by importing when needed

// ex. import {AsyncHandeler} from './utils/AsyncHandler'
//  AsyncHandler(connectDB);

// by using try catch 

// const AsyncHandler = (requestHandler) =>{
//     return async (req , res , next)=>{
//         try {
//            await requestHandler(req , res , next)
//         } catch (err) {
//             res.status(err.code || 500).json({
//                 success : false ,
//                 message : err.message
//             }) 
//         }
//     }
// }

// by usiung Promise 

const AsyncHandler = (requestHandler)=>{
  return (req , res , next)=>{
    Promise.resolve(requestHandler(req , res ,next)).catch(
        (err)=>{
            return next(err);
        }
    )
   }
}

export {AsyncHandler}