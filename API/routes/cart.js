const router=require("express").Router();

const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const cryptoJs=require("crypto-js");
const Cart=require("../models/carts");//Cart mongoDB collection

//CREATE
router.post("/create",verifyToken,async(req,res)=>{
    const CartCreate=new Cart(req.body);

    try{
        const saveCart=await CartCreate.save();
        res.status(200).send(saveCart);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).send(updatedCart);
    }
    catch(e){
        res.status(500).send(e);
    }
})

// //DELETE     //any user can delete itself
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).send("Cart Has Been Deleted");
    }catch(e){
        res.status(500).send(err);
    }
})

// //GET Cart by user id 
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const CartData=await Cart.findOne({userId:req.params.userId});

        res.status(200).send(CartData);
    }catch(e){
        res.status(500).send(e);
    }
})

//GET ALL as ADMIN
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const Carts=await Cart.find();
        res.status(200).send(Carts);
    }catch(e){
        res.status(500).send(e);
    }
})


module.exports=router;