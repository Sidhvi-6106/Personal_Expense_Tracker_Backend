// import exp from 'express'
// import Transaction  from '../models/Transaction.js'
// import User from '../models/User.js';
// export const transactionRouter=exp.Router()
// transactionRouter.post('/transactions', async (req, res) => {
//     try {
//         // 1. Create and Save the Transaction
//         const newTransactionObj = new Transaction(req.body);
//         const savedTransaction = await newTransactionObj.save();
//         // 2. UPDATE THE USER (The missing step)
//         // This finds the user by the ID sent in the request and adds the new transaction ID to their list
//         await User.findByIdAndUpdate(
//             req.body.userId, 
//             { $push: { transactions: savedTransaction._id } }
//         );
//         return res.status(201).json({ 
//             message: "Transaction Added and Linked to User", 
//             payload: savedTransaction 
//         });
//     }
//     catch (err) {
//         console.error("Mongoose Error:", err.message);
//         res.status(400).json({ message: "Failed to add transaction" });
//     }
// });

// transactionRouter.get('/transactions',async(req,res)=>{
//     try{
//         const transactions=await Transaction.find({})
//         return res.status(201).json({ message: "Transactions Retrived ", count:transactions.length,payload: transactions });
//     }
//     catch(err){
//         console.error("Fetch Error :", err.message);
//         res.status(500).json({message:"Failed to fetch the Transaction"})
//     }
// })

// import exp from "express";
// import Transaction from "../models/Transaction.js";

// export const transactionRouter = exp.Router();

// // ADD TRANSACTION
// transactionRouter.post("/transactions", async (req, res) => {

//   try {

//     const newTransaction = new Transaction(req.body);

//     const savedTransaction = await newTransaction.save();

//     res.status(201).json({
//       message: "Transaction Added Successfully",
//       payload: savedTransaction
//     });

//   } catch (err) {

//     console.error("Mongoose Error:", err.message);

//     res.status(400).json({
//       message: "Failed to add transaction",
//       error: err.message
//     });

//   }

// });


// GET TRANSACTIONS OF A USER
// transactionRouter.get("/transactions/:userId", async (req, res) => {

//   try {

//     const transactions = await Transaction.find({
//       userId: req.params.userId
//     });

//     res.status(200).json({
//       message: "Transactions Retrieved",
//       count: transactions.length,
//       payload: transactions
//     });

//   } catch (err) {

//     console.error("Fetch Error:", err.message);

//     res.status(500).json({
//       message: "Failed to fetch transactions"
//     });

//   }

// });

// import exp from "express";
// import Transaction from "../models/Transaction.js";
// import User from "../models/User.js"; // 1. IMPORT USER MODEL

// export const transactionRouter = exp.Router();

// // ADD TRANSACTION
// transactionRouter.post("/transactions", async (req, res) => {
//   try {
//     // 2. Create and Save the Transaction
//     const newTransaction = new Transaction(req.body);
//     const savedTransaction = await newTransaction.save();

//     // 3. UPDATE THE USER DOCUMENT
//     // We push the savedTransaction._id into the user's transactions array
//     await User.findByIdAndUpdate(
//       req.body.userId, 
//       { $push: { transactions: savedTransaction._id } }
//     );

//     res.status(201).json({
//       message: "Transaction Added and Linked to User",
//       payload: savedTransaction
//     });

//   } catch (err) {
//     console.error("Mongoose Error:", err.message);
//     res.status(400).json({
//       message: "Failed to add transaction",
//       error: err.message
//     });
//   }
//   // GET TRANSACTIONS OF A USER
// transactionRouter.get("/transactions/:userId", async (req, res) => {

//   try {

//     const transactions = await Transaction.find({
//       userId: req.params.userId
//     });

//     res.status(200).json({
//       message: "Transactions Retrieved",
//       count: transactions.length,
//       payload: transactions
//     });

//   } catch (err) {

//     console.error("Fetch Error:", err.message);

//     res.status(500).json({
//       message: "Failed to fetch transactions"
//     });

//   }
// })
// });
import exp from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const transactionRouter = exp.Router();

// --- ADD TRANSACTION ---
// transactionRouter.post("/transactions", async (req, res) => {
//   try {
//     // 1. Create and Save the Transaction
//     const newTransaction = new Transaction(req.body);
//     const savedTransaction = await newTransaction.save();

//     // 2. UPDATE THE USER DOCUMENT
//     // Pushes the transaction ID into the User's transactions array
//     await User.findByIdAndUpdate(
//       req.body.userId, 
//       { $push: { transactions: savedTransaction._id } }
//     );

//     res.status(201).json({
//       message: "Transaction Added and Linked to User",
//       payload: savedTransaction
//     });

//   } catch (err) {
//     console.error("Mongoose Error:", err.message);
//     res.status(400).json({
//       message: "Failed to add transaction",
//       error: err.message
//     });
//   }
// }); // <--- Fixed: Properly closed the POST route here
// ADD TRANSACTION with ID in URL
transactionRouter.post("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Get ID from URL
    const { amount, category, date, description } = req.body; // Get data from Body

    // 1. Create the transaction and manually attach the userId
    const newTransaction = new Transaction({
      amount,
      category,
      date,
      description,
      userId // Attach the ID from the URL parameter
    });

    const savedTransaction = await newTransaction.save();

    // 2. Link the transaction to the User's array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: savedTransaction._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Transaction Added and Linked via URL ID",
      payload: savedTransaction
    });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ message: "Failed", error: err.message });
  }
});
// --- GET TRANSACTIONS OF A USER ---
transactionRouter.get("/transactions/:userId", async (req, res) => {
  try {
    // Finds all transactions belonging to this specific userId
    const transactions = await Transaction.find({
      userId: req.params.userId
    });

    res.status(200).json({
      message: "Transactions Retrieved",
      count: transactions.length,
      payload: transactions
    });

  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch transactions"
    });
  }
}); // <--- Properly closed the GET route here