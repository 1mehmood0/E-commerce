const router=require("express").Router();

const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const cryptoJs=require("crypto-js");
const Product=require("../models/products");//Product mongoDB collection

//CREATE
router.post("/create",verifyTokenAndAdmin,async(req,res)=>{
    const productCreate=new Product(req.body);

    try{
        const saveProduct=await productCreate.save();
        res.status(200).send(saveProduct);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).send(updatedProduct);
    }
    catch(e){
        res.status(500).send(e);
    }
})

// //DELETE     //any user can delete itself
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).send("Product Has Been Deleted");
    }catch(e){
        res.status(500).send(err);
    }
})

// //GET Product by id   &  user& admin can get other users
router.get("/find/:id",async(req,res)=>{
    try{
        const productData=await Product.findById(req.params.id)

        res.status(200).send(productData);
    }catch(e){
        res.status(500).send(e);
    }
})

//GET ALL PRODUCT
router.get("/",async(req,res)=>{
    const queryNew=req.query.new;//query by the name of "new"
    const queryCategory=req.query.category;
    try{
        let products;
        if(queryNew){
            products=await Product.find().sort({createdAt:-1}).limit(2);
        res.status(200).send(products);
        }
        else if(queryCategory)
        {
            products=await Product.find({categories:{$in:[queryCategory]}});
        }
        else{
            products=await Product.find();

        }
        res.status(200).send(products);
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports=router;
