import exp from 'express'
import {connect } from "mongoose"
import {config} from "dotenv"
import { authRouter } from './routes/auth.js'
import { transactionRouter } from './routes/transactions.js'
import { analyticsRouter } from './routes/analytics.js'

config() //process.env
const app=exp()
//connect to db
// pr
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use(exp.json())
//connect apis
app.use('/auth-api',authRouter)
app.use('/transactions-api',transactionRouter)
app.use('/analytics-api',analyticsRouter)
// app.use('emi-api',emiRouter)

//connect db function expression
const connectdb=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DataBase Connection Success")
        app.listen(process.env.PORT,()=>console.log("Server Started"))
    }catch(err){
        console.log("err in connecting database",err)
    }
}

connectdb()

app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }
  //JSON Parsing errors
  if(err instanceof SyntaxError && err.status===400 && 'body' in err){
    return res.status(400).json({
      message:"Bad JSON Format",
      error:"check for Trailing commas or missing quotes"
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // handle custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});