const cron=require("node-cron");
const pool=require("../config/db");

cron.schedule("* * * * *",async()=>{
        console.log("Checking expired bookings...");;
         const client = await pool.connect();
         try {
             await client.query("BEGIN");
              const result = await client.query(
            `
            SELECT *
            FROM bookings
            WHERE booking_status='PENDING'
            AND created_at <= NOW() - INTERVAL '5 minutes'
            `
        );
        const bookings = result.rows;

          for (const booking of bookings) {
             await client.query(
                `
                UPDATE bookings
                SET booking_status='CANCELLED'
                WHERE id=$1
                `,
                [booking.id]
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
               await client.query("COMMIT");
          }
         } catch (error) {
            await client.query("ROLLBACK");
              console.log(error);
         }
          finally {

        client.release();

    }

})