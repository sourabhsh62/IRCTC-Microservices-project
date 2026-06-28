const express=require("express")
const router=express.Router();
const trainController=require("../controllers/train.controller");
const validate=require("../middlewares/validation.middleware")
const {

createTrainSchema,

initializeInventorySchema,

bookTicketSchema,

cancelTicketSchema,

searchTrainSchema,

availableSeatsSchema,

myBookingSchema

}=require("../validators/booking.validator");

router.post("/trains",validate(createTrainSchema),trainController.createTrain);
router.get("/trains", trainController.getAllTrains);
router.get("/search-trains",validate(searchTrainSchema,"query"),trainController.searchTrains);
router.post("/inventory/init",validate(initializeInventorySchema),trainController.initializeInventory);
router.post("/book-ticket",validate(bookTicketSchema),trainController.bookTicket);
router.get("/my-booking/:userId",validate(myBookingSchema,"params"),trainController.getMyBookings)
router.post("/cancel-ticket",validate(cancelTicketSchema),trainController.cancelTicket);
router.get('/available-seats', validate(availableSeatsSchema,"query"),trainController.getAvailableSeats);
module.exports=router;