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

                    userId: 1,

                    trainId: 1,

                    travelDate: "2026-07-10",

                    seatNumber: 10

                });

                expect(result.message)

                    .toBe(

                        "Ticket booked successfully"

                    );


                expect(acquireLock)

                    .toHaveBeenCalled();
                expect(userBreaker.fire)

                    .toHaveBeenCalledWith(

                        1

                    );

                expect(axios.get)

                    .toHaveBeenCalled();

                expect(pool.connect)

                    .toHaveBeenCalled();

                expect(client.query)

                    .toHaveBeenCalledTimes(

                        5

                    );

                expect(emit)

                    .toHaveBeenCalled();


                expect(releaseLock)

                    .toHaveBeenCalled();



            });

            
test(
    "should throw error if seat is already booked",
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

        pool.connect.mockResolvedValue(client);

        // BEGIN
        client.query.mockResolvedValueOnce();

        // SELECT Seat
        client.query.mockResolvedValueOnce({
            rows: [
                {
                    status: "BOOKED"
                }
            ]
        });

        // ROLLBACK
        client.query.mockResolvedValueOnce();

        await expect(
            bookTicket({
                userId: 1,
                trainId: 1,
                travelDate: "2026-07-10",
                seatNumber: 10
            })
        ).rejects.toThrow("Seat already booked");

        expect(client.query).toHaveBeenCalledTimes(3);

        expect(releaseLock).toHaveBeenCalled();

        expect(emit).not.toHaveBeenCalled();

    }
);


test(
    "should throw error if user not found",
    async () => {

        acquireLock.mockResolvedValue(true);

        // User Service returned null
        userBreaker.fire.mockResolvedValue(null);

        await expect(
            bookTicket({
                userId: 1,
                trainId: 1,
                travelDate: "2026-07-10",
                seatNumber: 10
            })
        ).rejects.toThrow("User not found");

        expect(acquireLock).toHaveBeenCalled();

        expect(userBreaker.fire).toHaveBeenCalledWith(1);

        expect(axios.get).not.toHaveBeenCalled();

        expect(pool.connect).not.toHaveBeenCalled();

        expect(releaseLock).not.toHaveBeenCalled();

    }
);


test(
    "should throw error if train not found",
    async () => {

        acquireLock.mockResolvedValue(true);

        userBreaker.fire.mockResolvedValue({
            id: 1,
            email: "test@gmail.com"
        });

        // Train Service returned null
        axios.get.mockResolvedValue({
            data: null
        });

        await expect(
            bookTicket({
                userId: 1,
                trainId: 1,
                travelDate: "2026-07-10",
                seatNumber: 10
            })
        ).rejects.toThrow("Train not found");

        expect(acquireLock).toHaveBeenCalled();

        expect(userBreaker.fire).toHaveBeenCalledWith(1);

        expect(axios.get).toHaveBeenCalled();

        expect(pool.connect).not.toHaveBeenCalled();

        expect(releaseLock).toHaveBeenCalled();

    }
);

    });