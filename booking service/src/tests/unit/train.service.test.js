const axios = require("axios");

const pool = require("../../config/db");

const userBreaker = require("../../utils/userClient");

const {

acquireLock,

releaseLock

} = require("../../utils/redisLock");

const {

getIO

} = require("../../socket");

const {

bookTicket

} = require("../../services/train.service");


jest.mock("../../config/db");

jest.mock("axios");

jest.mock("../../utils/userClient");

jest.mock("../../utils/redisLock");

jest.mock("../../socket");


describe(

"Book Ticket Service",

()=>{

    beforeEach(()=>{

        jest.clearAllMocks();

    });

    test(

"should book ticket successfully",

async()=>{

    acquireLock.mockResolvedValue(true);

});


});