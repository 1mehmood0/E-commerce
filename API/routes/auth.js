const router=require("express").Router();
const User=require("../models/users");
const cryptoJs=require("crypto-js");
const jwt=require("jsonwebtoken");



//REGISTER
router.post("/register",async(req,res)=>{
    try{
        const userInfo=await new User({
            username:req.body.username,
            email:req.body.email,
            password:cryptoJs.AES.encrypt(req.body.password,process.env.PASS_KEY).toString(),
        });
        const dataIntoDb=await userInfo.save();
        res.status(201).send(dataIntoDb);
    }
    catch(e){
        res.status(500).send(e);
    }
});


//LOGIN
router.post("/login",async(req,res)=>{
    try{
        const userData=await User.findOne({username:req.body.username});//finding complete document of user with findONE
        console.log()
        !userData && res.status(401).send("Wrong Credentials");//username check
  
        const deHashPass=cryptoJs.AES.decrypt(userData.password,process.env.PASS_KEY);//decrypting password got from the document
        const finPass=deHashPass.toString(cryptoJs.enc.Utf8);

       finPass!==req.body.password&&res.status(401).send("Wrong Credentials");//password check
       
       const accessToken=jwt.sign(
           {                        //JSON WEB TOKEN
               id:userData._id,
               isAdmin:userData.isAdmin,
           },
           process.env.JWT_KEY,//JWT KEY 
           {expiresIn:"3d"}
       );

       const{password,...others}=userData._doc;//hiding password

       res.status(200).send({...others,accessToken});
       
    }
    catch(e)
    {
        res.status(500).send(e);
    }
});

module.exports=router;