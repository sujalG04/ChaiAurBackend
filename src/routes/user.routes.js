import { Router } from "express";
import { registerUser , loginUser, logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    // single use to handle only 1 file 
    // fields use to handle multiple files
    upload.fields([
        {
            name: "avatar", // this name should be same at both backend and frontend
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)    

router.route("/logout").post( verifyJWT , logoutUser)

export default router;