const request = require("supertest");

const app = require("../../app");

const trainService = require("../../services/train.service");

jest.mock("../../services/train.service");

describe("Available Seats API", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test(
        "should return available seats successfully",
        async () => {

            trainService.getAvailableSeats.mockResolvedValue({

                availableSeats: 5,

                seats: [

                    {
                        seat_number: 1,
                        status: "AVAILABLE"
                    },

                    {
                        seat_number: 2,
                        status: "AVAILABLE"
                    }

                ]

            });

            const response = await request(app)
                .get("/available-seats")
                .query({

                    trainId: 1,

                    travelDate: "2026-07-10"

                });

            expect(response.statusCode).toBe(200);

            expect(response.body.availableSeats).toBe(5);

            expect(trainService.getAvailableSeats)
                .toHaveBeenCalledWith(
                    "1",
                    "2026-07-10"
                );

        }

    );

    test(

    "should return 400 when query parameters are missing",

    async () => {

        const response = await request(app)

            .get("/available-seats");

        expect(response.statusCode)

            .toBe(400);

        expect(trainService.getAvailableSeats)

            .not.toHaveBeenCalled();

    }

);

});