const router=require("express").Router();
const stripe=require("stripe");

router.post("/payment",(req,res)=>{
    stripe.charges.create(
        {
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"INR",
        },(stripeErr,StripeRes)=>{
            if(stripeErr){
                res.status(500).send(stripeErr);
            }
            else{
                res.status(200).send(StripeRes);
            }
        }
    );
});

module.export=router;