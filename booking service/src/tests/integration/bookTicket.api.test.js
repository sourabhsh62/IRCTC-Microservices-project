const request = require("supertest");

const app = require("../../app");
const trainService = require("../../services/train.service");

jest.mock("../../services/train.service");

describe("Book Ticket API", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test(
    "should return 200 when ticket booked successfully",
    async () => {

        trainService.bookTicket.mockResolvedValue({
            message: "Ticket booked successfully"
        });

        const response = await request(app)
            .post("/book-ticket")
            .send({
                userId: 1,
                trainId: 1,
                travelDate: "2026-07-10",
                seatNumber: 10
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Ticket booked successfully");

        expect(trainService.bookTicket)
            .toHaveBeenCalled();

    }
);
test(
    "should return 400 when required fields are missing",
    async () => {

        const response = await request(app)
            .post("/book-ticket")
            .send({
                userId: 1,
                trainId: 1
            });

        expect(response.statusCode).toBe(400);

        expect(trainService.bookTicket)
            .not.toHaveBeenCalled();

    }
);


});