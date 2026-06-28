/**
 * @swagger
 * tags:
 *   - name: Trains
 *     description: Train Management APIs
 */









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


/**
 * @swagger
 * /trains:
 *   post:
 *     summary: Create a new train
 *     tags: [Trains]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainNumber
 *               - trainName
 *               - source
 *               - destination
 *             properties:
 *               trainNumber:
 *                 type: string
 *                 example: "12951"
 *               trainName:
 *                 type: string
 *                 example: "Rajdhani Express"
 *               source:
 *                 type: string
 *                 example: "NDLS"
 *               destination:
 *                 type: string
 *                 example: "BCT"
 *     responses:
 *       201:
 *         description: Train created successfully
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Train already exists
 */
router.post("/trains",validate(createTrainSchema),trainController.createTrain);
/**
 * @swagger
 * /trains:
 *   get:
 *     summary: Get all trains
 *     description: Returns the complete list of trains.
 *     tags: [Trains]
 *
 *     responses:
 *
 *       200:
 *         description: Train list fetched successfully
 *
 *       500:
 *         description: Internal Server Error
 */
router.get("/trains", trainController.getAllTrains);
router.get("/search-trains",validate(searchTrainSchema,"query"),trainController.searchTrains);
router.post("/inventory/init",validate(initializeInventorySchema),trainController.initializeInventory);
router.post("/book-ticket",validate(bookTicketSchema),trainController.bookTicket);
router.get("/my-booking/:userId",validate(myBookingSchema,"params"),trainController.getMyBookings)
router.post("/cancel-ticket",validate(cancelTicketSchema),trainController.cancelTicket);
router.get('/available-seats', validate(availableSeatsSchema,"query"),trainController.getAvailableSeats);
module.exports=router;