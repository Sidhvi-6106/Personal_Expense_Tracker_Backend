import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const checkUser = async (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // attach user to request
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};