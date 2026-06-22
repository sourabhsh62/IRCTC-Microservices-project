const express=require("express")
const router=express.Router();
router.post("/pay",paymentController.pay);
router.post("/payment-fail",paymentController.paymentFail);