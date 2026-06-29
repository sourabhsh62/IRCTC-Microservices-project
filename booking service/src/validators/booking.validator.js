const Joi=require("joi")
const bookTicketSchema=Joi.object({
    userId: Joi.number()
        .required(),

    trainId: Joi.number()
        .required(),

    travelDate: Joi.string()
        .required(),

    seatNumber: Joi.number()
        .required()

})

const createTrainSchema = Joi.object({

    trainNumber: Joi.string()
        .required(),

    trainName: Joi.string()
        .min(3)
        .max(100)
        .required(),

    source: Joi.string()
        .required(),

    destination: Joi.string()
        .required()

});

const initializeInventorySchema = Joi.object({

    trainId:Joi.number()
    .integer()
    .required(),

    travelDate:Joi.string()
    .required(),

    totalSeats:Joi.number()
    .integer()
    .min(1)
    .required()

});
const cancelTicketSchema = Joi.object({

    bookingId:Joi.number()
    .integer()
    .required()

});

const searchTrainSchema = Joi.object({

    source: Joi.string()
        .required(),

    destination: Joi.string()
        .required()

});

const availableSeatsSchema = Joi.object({

    trainId: Joi.number()
        .integer()
        .required(),

    travelDate: Joi.string()
        .required()

});
const myBookingSchema = Joi.object({

    userId: Joi.number()
        .integer()
        .required()

});


module.exports = {
    bookTicketSchema,createTrainSchema,initializeInventorySchema,cancelTicketSchema,searchTrainSchema,availableSeatsSchema,myBookingSchema
};