const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    service:"gmail",auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

async function sendBookingMail(to,trainName,seatNumber){
await transporter.sendMail({from:process.env.EMAIL,to,subject:"Ticket confirmed",text:`your seat ${seatNumber} in ${trainName} has been confirmed`})
}
module.exports={sendBookingMail}
    




