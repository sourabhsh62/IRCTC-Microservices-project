const request = require("supertest");

const app = require("../../app");

const trainService = require("../../services/train.service");

jest.mock("../../services/train.service");

describe("Cancel Ticket API", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test(
        "should cancel ticket successfully",
        async () => {

            trainService.cancelTicket.mockResolvedValue({
                message: "Ticket cancelled successfully"
            });

            const response = await request(app)
                .post("/cancel-ticket")
                .send({
                    bookingId: 1
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.message)
                .toBe("Ticket cancelled successfully");

            expect(trainService.cancelTicket)
                .toHaveBeenCalledWith({
                    bookingId: 1
                });

        }
    );

});