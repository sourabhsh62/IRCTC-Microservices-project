const trainService = require("../services/train.service");

async function createTrain(req, res) {
    try {
        const result = await trainService.createTrain(req.body);
        return res.status(201).json(result)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

async function getAllTrains(req, res) {
    try {
        const trains = await trainService.getAllTrains();
        return res.status(200).json(trains);
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

async function searchTrains(req, res) {
    try {
        const { source, destination } = req.query;
        const result = await trainService.searchTrains(source, destination);
        return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({message:error.message})
    }

}

async function initializeInventory(req,res){
    try {
        const result=await trainService.initializeInventory(req.body)
        return res.status(201).json(result)
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}


async function bookTicket(req, res) { 
  try { 
    const result = await trainService.bookTicket(req.body); 
    return res.status(201).json(result); 
  } catch(error) { 
    return res.status(400).json({ message: error.message }); 
  } 
}


async function getMyBookings(req,res){
    try {
        const result=await trainService.getMyBookings(req.params.userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


async function cancelTicket(req,res){

    try{

        const result=
        await trainService.cancelTicket(
            req.body
        );

        return res.status(200).json(result);

    }catch(error){

        return res.status(400).json({
            message:error.message
        });

    }

}

async function getAvailableSeats(req, res) {
  try {
    const { trainId, travelDate } = req.query;

    const result = await trainService.getAvailableSeats(trainId, travelDate);

    return res.status(200).json(result);
    
  } catch (error) {
    return res.status(400).json({
      message:error.message
    });
  }
}


module.exports = { createTrain, getAllTrains ,searchTrains,initializeInventory,bookTicket,getMyBookings,cancelTicket,getAvailableSeats};