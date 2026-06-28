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
/**
 * @swagger
 * /search-trains:
 *   get:
 *     summary: Search trains between two stations
 *     description: Returns all trains available between source and destination stations.
 *     tags: [Trains]
 *
 *     parameters:
 *
 *       - in: query
 *         name: source
 *         required: true
 *         schema:
 *           type: string
 *         example: NDLS
 *
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         example: BCT
 *
 *     responses:
 *
 *       200:
 *         description: Train list fetched successfully
 *
 *       400:
 *         description: Validation Error
 *
 *       404:
 *         description: No trains found
 */
router.get("/search-trains",validate(searchTrainSchema,"query"),trainController.searchTrains);
/**
 * @swagger
 * /inventory/init:
 *   post:
 *     summary: Initialize seat inventory
 *     description: Creates seat inventory for a train on a travel date.
 *     tags: [Trains]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainId
 *               - travelDate
 *               - totalSeats
 *
 *             properties:
 *
 *               trainId:
 *                 type: integer
 *                 example: 1
 *
 *               travelDate:
 *                 type: string
 *                 example: "2026-07-10"
 *
 *               totalSeats:
 *                 type: integer
 *                 example: 120
 *
 *     responses:
 *
 *       201:
 *         description: Inventory initialized successfully
 *
 *       400:
 *         description: Validation Error
 */
router.post("/inventory/init",validate(initializeInventorySchema),trainController.initializeInventory);
/**
 * @swagger
 * /book-ticket:
 *   post:
 *     summary: Book a train ticket
 *     description: Books a seat for a user if it is available.
 *     tags: [Trains]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *
 *         application/json:
 *
 *           schema:
 *
 *             type: object
 *
 *             required:
 *               - userId
 *               - trainId
 *               - travelDate
 *               - seatNumber
 *
 *             properties:
 *
 *               userId:
 *                 type: integer
 *                 example: 5
 *
 *               trainId:
 *                 type: integer
 *                 example: 1
 *
 *               travelDate:
 *                 type: string
 *                 example: "2026-07-10"
 *
 *               seatNumber:
 *                 type: integer
 *                 example: 15
 *
 *     responses:
 *
 *       200:
 *         description: Ticket booked successfully
 *
 *       400:
 *         description: Validation Error
 *
 *       404:
 *         description: User or Train not found
 *
 *       409:
 *         description: Seat already booked
 */
router.post("/book-ticket",validate(bookTicketSchema),trainController.bookTicket);
/**
 * @swagger
 * /my-booking/{userId}:
 *   get:
 *     summary: Get bookings of a user
 *     description: Returns all bookings for the specified user.
 *     tags: [Trains]
 * *     security:
*       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: userId
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         example: 5
 *
 *     responses:
 *
 *       200:
 *         description: Booking list fetched successfully
 *
 *       404:
 *         description: User not found
 */
router.get("/my-booking/:userId",validate(myBookingSchema,"params"),trainController.getMyBookings)

/**
 * @swagger
 * /cancel-ticket:
 *   post:
 *     summary: Cancel a booked ticket
 *     description: Cancels an existing booking and releases the booked seat.
 *     tags: [Trains]
 * *     security:
*       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *
 *         application/json:
 *
 *           schema:
 *
 *             type: object
 *
 *             required:
 *               - bookingId
 *
 *             properties:
 *
 *               bookingId:
 *                 type: integer
 *                 example: 25
 *
 *     responses:
 *
 *       200:
 *         description: Ticket cancelled successfully
 *
 *       400:
 *         description: Validation Error
 *
 *       404:
 *         description: Booking not found
 *
 *       409:
 *         description: Booking already cancelled
 */
router.post("/cancel-ticket",validate(cancelTicketSchema),trainController.cancelTicket);
/**
 * @swagger
 * /available-seats:
 *   get:
 *     summary: Get available seats
 *     description: Returns available seats for a train on a specific travel date.
 *     tags: [Trains]
 * *     security:
*       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: trainId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: travelDate
 *         required: true
 *         schema:
 *           type: string
 *         example: 2026-07-10
 *
 *     responses:
 *
 *       200:
 *         description: Available seats fetched successfully
 *
 *       400:
 *         description: Validation Error
 */
router.get('/available-seats', validate(availableSeatsSchema,"query"),trainController.getAvailableSeats);
module.exports=router;