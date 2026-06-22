const pool = require("../config/db");
const redisClient = require("../config/redis");
const { getIO } =
    require("../socket");
const axios = require("axios");

const {
    acquireLock,
    releaseLock
}
    =
    require("../utils/redisLock");


async function createTrain(data) {
    const { trainNumber, trainName, source, destination } = data;

    if (
        !trainNumber ||
        !trainName ||
        !source ||
        !destination
    ) {
        throw new Error("All fields are required");
    }

    const existingTrain = await pool.query(`SELECT * FROM trains WHERE train_number = $1`, [trainNumber])
    if (existingTrain.rows.length > 0) {
        throw new Error("Train already exists");
    }

    await pool.query(`  INSERT INTO trains(train_number,train_name,source,destination) VALUES($1,$2,$3,$4)`, [trainNumber, trainName, source, destination]);

    return { message: "train created successfully" };

}

async function getAllTrains() {
    const result = await pool.query(`SELECT * FROM trains ORDER BY id ASC`);
    return result.rows;
}

async function searchTrains(source, destination) {

    const key =
        `${source}-${destination}`;

    const cachedData =
        await redisClient.get(key);

    if (cachedData) {

        return JSON.parse(
            cachedData
        );

    }

    const result = await pool.query(`
    SELECT DISTINCT
        t.id,
        t.train_number,
        t.train_name

    FROM trains t

    JOIN train_stations ts1
    ON t.id = ts1.train_id

    JOIN train_stations ts2
    ON t.id = ts2.train_id

    JOIN stations s1
    ON ts1.station_id = s1.id

    JOIN stations s2
    ON ts2.station_id = s2.id

    WHERE s1.station_code = $1
    AND s2.station_code = $2
    AND ts1.stop_order < ts2.stop_order
    `,
        [source, destination])

    await redisClient.set(
        key,
        JSON.stringify(
            result.rows
        )
    );

    return result.rows;

}

async function initializeInventory(data) {
    const { trainId, travelDate, totalSeats } = data;
    console.log(totalSeats)
    for (let seat = 1; seat <= totalSeats; seat++) {
        await pool.query(`INSERT INTO seat_inventory(train_id,travel_date,seat_number,status) VALUES($1,$2,$3,$4)`, [trainId, travelDate, seat, "AVAILABLE"]);
    }
    return { message: "Inventory  initialized successfully" }

}


async function bookTicket(data) {
    const { userId, trainId, travelDate, seatNumber } = data;
    const response = await axios.get(
        `http://localhost:3001/users/${userId}`
    );

    const user = response.data;

    if (!user) {
        throw new Error("User not found");
    }
    const lockKey =
        `seat:${trainId}:${travelDate}:${seatNumber}`;

    const isLocked =
        await acquireLock(
            lockKey
        );

    if (!isLocked) {

        throw new Error(
            "Seat is being booked by another user"
        );

    }


    const client = await pool.connect();
    try {

        await client.query("BEGIN");
        const seatResult = await client.query(` SELECT *
            FROM seat_inventory
            WHERE train_id = $1
            AND travel_date = $2
            AND seat_number = $3
            FOR UPDATE
            `,
            [trainId, travelDate, seatNumber]
        )
        const seat = seatResult.rows[0];
        if (!seat) {
            throw new Error("Seat not found");
        }
        if (seat.status !== "AVAILABLE") {
            throw new Error("Seat already booked");
        }

        await client.query(
            `
            INSERT INTO bookings
            (
                user_id,
                train_id,
                travel_date,
                seat_number,
                booking_status
            )
            VALUES
            ($1,$2,$3,$4,$5)
            `,
            [
                userId,
                trainId,
                travelDate,
                seatNumber,
                "PENDING"
            ]
        );


        await client.query(
            `
            UPDATE seat_inventory
            SET status='BOOKED'
            WHERE train_id=$1
            AND travel_date=$2
            AND seat_number=$3
            `,
            [
                trainId,
                travelDate,
                seatNumber
            ]
        );

        await client.query("COMMIT");

        getIO().emit(
            "seatBooked",
            {
                trainId,
                travelDate,
                seatNumber
            }
        );

        return {
            message: "Ticket booked successfully"
        };


    } catch (error) {

        await client.query("ROLLBACK");
        throw error;
    }

    finally {
        await releaseLock(
            lockKey
        );

        client.release();
    }
}

async function getMyBookings(userId) {
    const result = await pool.query(`
SELECT
b.id,
t.train_name,
b.seat_number,
b.travel_date,
b.booking_status

FROM bookings b

JOIN trains t
ON b.train_id=t.id

WHERE b.user_id=$1
`,
        [userId]);
    return result.rows;
}


async function cancelTicket(data) {

    const { bookingId } = data;

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const bookingResult =
            await client.query(
                `
            SELECT *
            FROM bookings
            WHERE id=$1
            FOR UPDATE
            `,
                [bookingId]
            );

        const booking =
            bookingResult.rows[0];

        if (!booking) {

            throw new Error(
                "Booking not found"
            );

        }

        if (
            booking.booking_status
            === "CANCELLED"
        ) {

            throw new Error(
                "Booking already cancelled"
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
                "Ticket cancelled successfully"
        };

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();

    }

}

async function getAvailableSeats(
    trainId,
    travelDate
) {

    const result =
        await pool.query(
            `
        SELECT *
        FROM seat_inventory
        WHERE train_id=$1
        AND travel_date=$2
        AND status='AVAILABLE'
        `,
            [
                trainId,
                travelDate
            ]
        );

    return {
        availableSeats:
            result.rows.length,

        seats:
            result.rows
    };

}

module.exports = { createTrain, getAllTrains, searchTrains, initializeInventory, bookTicket, getMyBookings, cancelTicket, getAvailableSeats };

//   Sab trains lao
// Aur id ke hisaab se sort karo