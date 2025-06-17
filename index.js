const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const BookingModel = require('./booking_schema.js');
const TableModel = require('./table_schema.js'); 
const UserModel = require('./person_schema.js'); 

function uniqueid(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// View Available Tables API
app.get('/viewavailabletables', (req, res) => {
    console.log('INSIDE VIEW AVAILABLE TABLES API...');
    TableModel.find({ status: 'available' })
        .then(tables => {
            if (tables.length === 0) {
                return res.status(404).send('<html><body>No available tables.</body></html>');
            }
            res.json(tables);
        })
        .catch(err => {
            console.error('Error fetching available tables:', err);
            res.status(500).send('<html><body>Error fetching tables.</body></html>');
        });
});

// BOOKING API
app.post('/booktables', async (req, res) => {
    console.log('INSIDE BOOK TABLE API...');
    const { name, phonenumber, tableId, numberofPeople, date, time} = req.body;
   // console.log('Request body:', req.body.name, req.body.phonenumber, req.body.numberofPeople, req.body.date, req.body.time);

    try {
        // Find available table that can fit the party size
        const table = await TableModel.findOne({ 
            status: 'available', 
            capacity: { $gte: parseInt(numberofPeople) } 
        });

        if (!table) {
            return res.status(404).send('<html><body>No suitable table available.</body></html>');
        }

        // Reserve the table
        const booking = new BookingModel({
            id: uniqueid(1000, 9999),
            name,
            phonenumber,
            tableId,
            numberofPeople,
            date,
            time,
            notes: req.body.notes || ''
        });

        await booking.save();

        // Update table status
        table.status = 'reserved';
        await table.save();

        res.status(200).send('<html><body>Table booked successfully!</body></html>');
    } catch (err) {
        console.error('Error booking table:', err);
        res.status(500).send('<html><body>Error booking table.</body></html>');
    }
});



// DELETE API
app.delete('/cancelbooking', async (req, res) => {
    console.log('INSIDE CANCEL BOOKING API...');
    const { id } = req.body;

    try {
        const booking = await BookingModel.findOneAndDelete({id:parseInt(req.body.id)});
        if (!booking) {
            return res.status(404).send('<html><body>Booking not found.</body></html>');
        }

        // Update the table status to available
        await TableModel.findOneAndUpdate(
            { tableId: booking.tableId },
            { status: 'available' },
            { new: true}
        );

        res.send('<html><body>Booking cancelled successfully!</body></html>');
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).send('<html><body>Error cancelling booking.</body></html>');
    }
});


//VIEW ALL BOOKINGS API
app.get('/viewbookings', (req, res) => {
    console.log('INSIDE VIEW BOOKINGS API...');
    const { phonenumber } = req.query;

    BookingModel.find({ phonenumber })
        .then(bookings => {
            if (bookings.length === 0) {
                return res.status(404).send('<html><body>No bookings found.</body></html>');
            }
            res.json(bookings);
        })
        .catch(err => {
            console.error('Error fetching bookings:', err);
            res.status(500).send('<html><body>Error fetching bookings.</body></html>');
        });
});




app.listen(5054, () =>
    console.log('EXPRESS Server Started at Port No: 5054!!!'));
