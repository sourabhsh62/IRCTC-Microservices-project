const express=require("express")
const router=express.Router();
const trainController=require("../controllers/train.controller");
router.post("/trains",trainController.createTrain);
router.get("/trains", trainController.getAllTrains);
router.get("/search-trains",trainController.searchTrains);
router.post("/inventory/init",trainController.initializeInventory);
router.post("/book-ticket",trainController.bookTicket);
router.get("/my-booking/:userId",trainController.getMyBookings)
router.post("/cancel-ticket",trainController.cancelTicket);
router.get('/available-seats', trainController.getAvailableSeats);
module.exports=router;