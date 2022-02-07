const router=require("express").Router();

const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const cryptoJs=require("crypto-js");
const Order=require("../models/orders");//Order mongoDB collection

//CREATE
router.post("/create",verifyToken,async(req,res)=>{
    const OrderCreate=new Order(req.body);
    try{
        const saveOrder=await OrderCreate.save();
        res.status(200).send(saveOrder);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedOrder=await Order.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).send(updatedOrder);
    }
    catch(e){
        res.status(500).send(e);
    }
})

// //DELETE     //any user can delete itself
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).send("Order Has Been Deleted");
    }catch(e){
        res.status(500).send(err);
    }
})

// //GET Order by user id 
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const OrderData=await Order.find({userId:req.params.userId});

        res.status(200).send(OrderData);
    }catch(e){
        res.status(500).send(e);
    }
})

//GET ALL as ADMIN
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const Orders=await Order.find();
        res.status(200).send(Orders);
    }catch(e){
        res.status(500).send(e);
    }
})

//GET MONTHLY INCOME
router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();//current date
    const lastMonth=new Date(date.setMonth(date.getMonth()-1));//month before
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));//month before month before
    const dateIso=previousMonth.toISOString();
    try{
        const income=await Order.aggregate([    //MongoDB aggregate method
            //  {      ---- BUUUGGGGGGGG----
            //     $match://pipeline-1
            //     {
            //         createdAt:{ $gte:ISODate("2021-12-07T19:03:30.248Z")},
            //     }
            // },
            {
                $project://pipeline-2
                {              
                    month:{$month:"$createdAt"}, //stores month
                    sales:"$amount",//stores amount of product
                }
            },
            {
                $group://pipeline-3
                {
                    _id:"$month",//all  months
                    totalSales:{$sum:"$sales"},//their respective sales sum   
                }
            },
        ]);
        res.status(200).send(income);
    }
    catch(e){
        res.status(500).send(e);
    }
});

module.exports=router;