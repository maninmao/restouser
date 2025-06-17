const schema_mongoose = require('mongoose');

const BookingSchema = schema_mongoose.Schema(
    {
        id: {type: Number},
        name: { type: String, required: true },
        phonenumber: { type: String, required: true },
        tableId: { type: String},
        numberofPeople: { type: Number, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        notes: { type: String, default: '' },

    }, 
    {
       timestamps: true
    }
    );

module.exports = schema_mongoose.model('booking_collection', BookingSchema);