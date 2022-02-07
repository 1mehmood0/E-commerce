const express=require('express');
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const port=process.env.PORT||5000;
dotenv.config();

const userRouter=require("./routes/user");
const authRouter=require("./routes/auth");
const productRouter=require("./routes/product");
const orderRouter=require("./routes/order");
const cartRouter=require("./routes/cart");

app.use(express.json());
app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);
app.use("/api/carts",cartRouter);

mongoose.connect(process.env.ATLAS_URL)
  .then(()=>{
    console.log("DB connection successful");
  })
  .catch((e)=>{
      console.log(e);
  }); 
  
  app.get("/api/test",(req,res)=>{
      //console.log("check test pass");
      res.send("hello from tester");
  });


app.listen(port,()=>{
    console.log(`Server running on port no ${port}`);
});