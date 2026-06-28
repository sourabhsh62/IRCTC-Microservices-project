const paymentService=require(
    "../services/payment.service"
);

const pay = asyncHandler(async (req, res, next) => {
    const result = await paymentService.pay(req.body);
    return res.status(200).json(result);
});

const paymentFail = asyncHandler(async (req, res, next) => {
    const result = await paymentService.paymentFail(req.body);
    return res.status(200).json(result);
});

module.exports={
    pay,paymentFail
}