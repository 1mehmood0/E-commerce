const express=require('express');
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const port=process.env.PORT||3000;
const hbs=require('hbs');
const path=require('path');

dotenv.config();


//static files path
const dirPath=path.join(__dirname,"../public");


//views folder path
const hbsPath=path.join(__dirname,"../tempelates/views");
hbs.registerPartials("../tempelates/views/Partials");
//setting tempelate engine
app.set('view engine','hbs');
app.set('views',hbsPath);


//to call css static page from public
app.use(express.static(dirPath));

const userRouter=require("./routes/user");
const authRouter=require("./routes/auth");
const productRouter=require("./routes/product");
const orderRouter=require("./routes/order");
const cartRouter=require("./routes/cart");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);
app.use("/api/carts",cartRouter);

mongoose.connect("mongodb+srv://admin:admin@myfirst-db.7rtlu.mongodb.net/Ecommerce?retryWrites=true&w=majority")
  .then(()=>{
    console.log("DB connection successful");
    
  })
  .catch((e)=>{
      console.log(e);
  }); 
  
 //routing
app.get("/",(req,res)=>{
  res.render("index");
})
app.get("/cart",(req,res)=>{
  res.render("cart");
})
app.get("/shop",(req,res)=>{
  res.render("shop");
})
app.get("/detail",(req,res)=>{
  res.render("detail");
})
app.get("/login",(req,res)=>{
  res.render("login");
})
app.get("/register",(req,res)=>{
  res.render("Register");
})
app.get("*",(req,res)=>{
  res.render("404",{
      errmsg:"TF YOU SEARCHING FOR BRO?"
  });
})

app.listen(port,()=>{
    console.log(`Server running on port no ${port}`);
  
});