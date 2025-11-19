import sendResponse from "../helpers/sendResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function protect(req, res, next) {
  try {
    console.log("req.headers.authorization from authenticateuser=> ", req.headers.authorization);
    const bearerToken = req.headers.authorization;
    if (!bearerToken) return sendResponse(res, 404, null, true, "Token not provided");
    
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    
    if (decoded) {
      console.log("decoded=>", decoded)
      const user = await User.findById(decoded._id).select('-password');
      if (!user) return sendResponse(res, 404, null, true, "User not found, signin again or create an account!") // ← FIXED: nulll to null
      req.user = decoded;
      next()
    } else {
      return sendResponse(res, 403, null, true, "Token not verified!");
    }
  } catch(error) {
    console.log("error from authenticateuser middleware=> ", error.message);
    sendResponse(res, 500, null, true, `Something went wrong in catch of authenticateuser middleware ${error.message}`);
  }
}




