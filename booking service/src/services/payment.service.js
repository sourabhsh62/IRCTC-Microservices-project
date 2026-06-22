const pool = require("../config/db");
const emailService =
    require("./email.service");
    
    const emailQueue=require("../jobs/email.queue");
const { sendPaymentSuccessEvent } = require("./kafka.producer"); 
async function pay(data) {

    const {
        bookingId,
        amount
    } = data;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        //check booking
        const bookingResult = await client.query(` SELECT *
            FROM bookings
            WHERE id=$1
            FOR UPDATE`, [bookingId])

        const booking =
            bookingResult.rows[0];
        if (!booking) {

            throw new Error(
                "Booking not found"
            );

        }
        if (
            booking.booking_status !==
            "PENDING"
        ) {

            throw new Error(
                "Booking already processed"
            );

        }

        const transactionId =
            "TXN" + Date.now();

        const userTrainResult =
            await client.query(
                `
SELECT
u.email,
t.train_name

FROM bookings b

JOIN users u
ON b.user_id=u.id

JOIN trains t
ON b.train_id=t.id

WHERE b.id=$1
`,
                [bookingId]
            );

        const user = userTrainResult.rows[0];

        await client.query(
            `
            INSERT INTO payments
            (
                booking_id,
                amount,
                payment_status,
                transaction_id
            )
            VALUES
            ($1,$2,$3,$4)
            `,
            [
                bookingId,
                amount,
                "SUCCESS",
                transactionId
            ]
        );

        // Update booking

        await client.query(
            `
            UPDATE bookings
            SET booking_status='CONFIRMED'
            WHERE id=$1
            `,
            [bookingId]
        );

        await client.query(
            "COMMIT"
        );

   await sendPaymentSuccessEvent({
    email:user.email,
    trainName:user.train_name,
    seatNumber:booking.seat_number
});

        return {
            message:
                "Payment successful",
            transactionId
        };

    } catch (error) {
        await client.query(
            "ROLLBACK"
        );

        throw error;
    }

    finally {

        client.release();

    }
}


async function paymentFail(data) {
    const { bookingId } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const bookingResult = await client.query(`
            SELECT *
            FROM bookings
            WHERE id=$1
            FOR UPDATE
            `,
            [bookingId])

        const booking =
            bookingResult.rows[0];

        if (!booking) {

            throw new Error(
                "Booking not found"
            );

        }

        await client.query(
            `
            UPDATE bookings
            SET booking_status='CANCELLED'
            WHERE id=$1
            `,
            [bookingId]
        );

        await client.query(
            `
            UPDATE seat_inventory
            SET status='AVAILABLE'
            WHERE train_id=$1
            AND travel_date=$2
            AND seat_number=$3
            `,
            [
                booking.train_id,
                booking.travel_date,
                booking.seat_number
            ]
        );

        await client.query(
            "COMMIT"
        );

        return {
            message:
                "Payment failed. Seat released."
        };


    } catch (error) {
        await client.query(
            "ROLLBACK"
        );

        throw error;

    }
    finally {

        client.release();

    }
}


module.exports = {
    pay, paymentFail
}