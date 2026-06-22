const {Worker}=require("bullmq");
const emailService=require("../services/email.service");
const worker=new Worker("emailQueue",async job=>{
    const {email,trainName,seatNumber}=job.data;
    await emailService.sendBookingMail(email,trainName,seatNumber);
},{connection:{host:"127.0.0.1",port:6379}});

module.exports=worker;
