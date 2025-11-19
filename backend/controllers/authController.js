import express from "express";
import User from "../models/User.js";
import sendResponse from "../helpers/sendResponse.js";
import jwt from 'jsonwebtoken'

const router = express.Router();

const Signup = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return sendResponse(res, 400, null, true, "Please provide all required fields");
        }
        
        // Trim whitespace
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        
        // Check if user exists
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return sendResponse(res, 409, null, true, "User Already Registered!");
        }

        console.log('Creating new user with:', {
            name: trimmedName,
            email: trimmedEmail,
            passwordLength: trimmedPassword.length
        });

        // Create user
        const newUser = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
        });

        console.log('User created successfully:', newUser._id);

        // Generate token
        const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.AUTH_SECRET);
        
        const responseData = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: token
        };
        
        sendResponse(res, 201, responseData, false, "User has been registered successfully");
    } catch (error) {
        console.log(`error from catch - backend - controllers - authcontroller.js ${error.message}`);
        sendResponse(res, 500, null, true, `Server error: ${error.message}`)
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return sendResponse(res, 400, null, true, "Please provide email and password");
        }
        
        // Trim whitespace from input
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        
        console.log('Login attempt - Email:', trimmedEmail);
        
        const user = await User.findOne({ email: trimmedEmail }).lean();
        
        if (!user) {
            console.log('User not found');
            return sendResponse(res, 404, null, true, "User not registered");
        }

        console.log('User found:', user.email);
        console.log('Stored password type:', typeof user.password);
        console.log('Stored password:', user.password);
        console.log('Provided password:', trimmedPassword);
        
        // Check if password exists and is a string
        if (!user.password || typeof user.password !== 'string') {
            console.error('Invalid password format in database');
            return sendResponse(res, 500, null, true, "Password data is corrupted. Please contact support.");
        }
        
        // Compare passwords (trim the stored password safely)
        const storedPassword = user.password.toString().trim();
        if (storedPassword !== trimmedPassword) {
            console.log('Password mismatch');
            return sendResponse(res, 401, null, true, "Incorrect Password!");
        }

        console.log('Password matched! Generating token...');
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.AUTH_SECRET);
        
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        };
        
        sendResponse(res, 200, responseData, false, "Logged in Successfully!");
    } catch (error) {
        console.log(`error from catch - backend - controllers - authcontroller.js ${error.message}`);
        sendResponse(res, 500, null, true, `Server error: ${error.message}`)
    }
}
const getUserInfo = async (req, res) => {
   try {
     const user = await User.findOne({_id: req.user._id}).select('-password');
     sendResponse(res, 200, user, false, "User data fetched successfully!")
   } catch(error) {
    console.log(`error from backed - authcontroller.js - getusermyinfo() - ${error.message}`);
    sendResponse(res, 500, null, true, error.message)
   }
}

export default { Signup, Login, getUserInfo }