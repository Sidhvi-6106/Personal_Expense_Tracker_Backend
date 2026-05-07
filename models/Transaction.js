// import {model,Schema}  from "mongoose";
// //create Transaction schema
// const transactionSchema = new Schema({
//     amount: {
//         type: Number,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true
//     },
//     description: {
//         type: String,
//         required: false
//     },  
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// });
// //create Transaction model
// const Transaction = model('Transaction', transactionSchema);
// //export Transaction model
// export default Transaction;
 import mongoose, { model, Schema } from "mongoose";

const transactionSchema = new Schema({

  amount: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  description: {
    type: String
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
},
  {
        timestamps:true,
        strict:"throw",
        versionKey:false
});

const Transaction = model("Transaction", transactionSchema);

export default Transaction;