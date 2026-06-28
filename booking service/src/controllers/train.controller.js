const trainService = require("../services/train.service");
const asyncHandler=require("../middlewares/asyncHandler")

const createTrain = asyncHandler(async (req, res, next) => {
    const result = await trainService.createTrain(req.body);
    return res.status(201).json(result);
});


const getAllTrains = asyncHandler(async (req, res, next) => {
    const trains = await trainService.getAllTrains();
    return res.status(200).json(trains);
});


const searchTrains = asyncHandler(async (req, res, next) => {
    const { source, destination } = req.query;
    const result = await trainService.searchTrains(source, destination);
    return res.status(200).json(result);
});

const initializeInventory = asyncHandler(async (req, res, next) => {
    const result = await trainService.initializeInventory(req.body);
    return res.status(201).json(result);
});



const bookTicket=asyncHandler(async(req,res)=>{
    const result=await trainService.bookTicket(req.body);
    res.json(result);
})




async function getMyBookings(req,res,next){
    try {
        const result=await trainService.getMyBookings(req.params.userId);
        return res.status(200).json(result);
    } catch (error) {
         next(error)
    }
}


async function cancelTicket(req,res,next){

    try{

        const result=
        await trainService.cancelTicket(
            req.body
        );

        return res.status(200).json(result);

    }catch(error){

         next(error)

    }

}

async function getAvailableSeats(req, res,next) {
  try {
    const { trainId, travelDate } = req.query;

    const result = await trainService.getAvailableSeats(trainId, travelDate);

    return res.status(200).json(result);
    
  } catch (error) {
     next(error)
  }
}


module.exports = { createTrain, getAllTrains ,searchTrains,initializeInventory,bookTicket,getMyBookings,cancelTicket,getAvailableSeats};