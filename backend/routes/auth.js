
import express from "express";
import authController from "../controllers/authController.js";
import authenticateUser from "../middlewares/authenticateUser.js";


const router = express.Router();
router.post("/signup",authController.Signup);
router.post("/login", authController.Login);
router.get("/getUserInfo",  authenticateUser,  authController.getUserInfo);

export default router;