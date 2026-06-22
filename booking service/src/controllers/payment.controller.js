const paymentService=require(
    "../services/payment.service"
);

async function pay(req,res){

    try{

        const result=
        await paymentService.pay(
            req.body
        );

        return res.status(200).json(result);

    }catch(error){

        return res.status(400).json({
            message:error.message
        });

    }

}

async function paymentFail(req,res){
    try{
        const result=await paymentService.paymentFail(req.body);
        return res.status(200).json(result);
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}
module.exports={
    pay,paymentFail
}