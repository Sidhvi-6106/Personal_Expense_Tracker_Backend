import exp from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { checkUser } from "../middleware/checkUser.js";

export const authRouter = exp.Router();

//register
// https://wss32shz-4000.inc1.devtunnels.ms/
authRouter.post("/auth", async (req, res) => {
  try {

    const { username, email } = req.body;

    // check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken"
      });
    }

    // check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User Created Successfully",
      payload: userResponse
    });

  } catch (err) {

    console.error("Registration Error:", err);

    res.status(500).json({
      message: "Registration failed",
      error: err.message
    });

  }
});

//login
authRouter.post("/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        monthlyIncome: user.monthlyIncome
      }
    });

  } catch (err) {

    console.error("Login Error:", err);

    res.status(500).json({
      message: "Login failed",
      error: err.message
    });

  }

});


authRouter.get("/auth/profile", checkUser, async (req, res) => {
  try {
    // req.user comes from your checkUser middleware
    // We can fetch the user again but 'populate' the transactions array
    const userWithTransactions = await User.findById(req.user.userId).populate('transactions');

    if (!userWithTransactions) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile and transactions fetched",
      user: {
        id: userWithTransactions._id,
        username: userWithTransactions.username,
        email: userWithTransactions.email,
        monthlyIncome: userWithTransactions.monthlyIncome,
        transactions: userWithTransactions.transactions // Now contains full transaction details!
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});