// import exp from "express"
// import Transaction from "../models/Transaction.js"
// import EMI from "../models/EMI.js"

// export const analyticsRouter=exp.Router();
// analyticsRouter.get('/totals', async(req,res)=>{
//     try{
//         const data=await Transaction.aggregate([
//             {$group:{_id:"$category",totalAmount:{$sum:"$amount"}}}
//         ]);
//         res.status(200).json(data);
//     }catch(err){
//         res.status(500).json({message:"Error Fetching Analytics"})
//     }
// });
import exp from 'express';
import Transaction from '../models/Transaction.js';
import EMI from '../models/EMI.js'; // Ensure .js extension
export const analyticsRouter = exp.Router();
analyticsRouter.get('/overall-analysis/:id', async (req, res) => {
    try {
        // 1. Get Transaction totals by category
        const transactionData = await Transaction.aggregate([
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        // 2. Get EMI totals (usually EMIs are fixed, so we sum the 'amount')
        const emiData = await EMI.aggregate([
            { $group: { _id: "Fixed EMIs", total: { $sum: "$amount" } } }
        ]);

        // 3. Combine them into one array for the chart
        const finalData = [...transactionData, ...emiData];

        res.status(200).json(finalData);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
});