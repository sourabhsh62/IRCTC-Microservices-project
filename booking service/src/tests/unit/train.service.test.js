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

    () => {

        beforeEach(() => {

            jest.clearAllMocks();

        });

        test(

            "should book ticket successfully",

            async () => {

                acquireLock.mockResolvedValue(true);
                userBreaker.fire.mockResolvedValue({

                    id: 1,

                    email: "test@gmail.com"

                });
                axios.get.mockResolvedValue({

                    data: {

                        id: 1,

                        trainName: "Rajdhani"

                    }

                });
                const emit = jest.fn();
                getIO.mockReturnValue({

                    emit

                });
                const client = {

                    query: jest.fn(),

                    release: jest.fn()

                };
                pool.connect.mockResolvedValue(

                    client

                );

                client.query
                    .mockResolvedValueOnce();
                client.query.mockResolvedValueOnce({

                    rows: [

                        {

                            status: "AVAILABLE"

                        }

                    ]

                });

                client.query
                    .mockResolvedValueOnce();

                client.query
                    .mockResolvedValueOnce();

                client.query
                    .mockResolvedValueOnce();

                 
                    const result = await bookTicket({

    userId:1,

    trainId:1,

    travelDate:"2026-07-10",

    seatNumber:10

});

expect(result.message)

.toBe(

"Ticket booked successfully"

);


expect(acquireLock)

.toHaveBeenCalled();


            });


    });