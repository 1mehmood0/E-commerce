const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const cryptoJs=require("crypto-js");
const router=require("express").Router();
const User=require("../models/users");

//UPDATE
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password=cryptoJs.AES.encrypt(req.body.password,process.env.PASS_KEY).toString();
    }
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).send(updatedUser);
    }
    catch(e){
        res.status(500).send(e);
    }
})

//DELETE     //any user can delete itself
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send("User Has Been Deleted");
    }catch(e){
        res.status(500).send(err);
    }
})

//GET user by id   &  only admin can get other users
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        const{password,...others}=user._doc;
        res.status(200).send(others);
    }catch(e){
        res.status(500).send(e);
    }
})

//GET ALL USER AS AN ADMIN
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query=req.query.new;//query by the name of "new"
    try{
        const users=query?await User.find().limit(5):await User.find();
        //const{password,...others}=users._doc;
        res.status(200).send(users);
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports=router;