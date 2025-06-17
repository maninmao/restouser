const schema_mongoose = require('mongoose');

const TableSchema = schema_mongoose.Schema(
    {
        id: {type: Number},
        tableId: { type: String, required: true, unique: true },
        status: { type: String, enum: ['available', 'reserved'], default: 'available'},
        capacity: { type: Number },
    }, 
    {
       timestamps: true
    }
    );

module.exports = schema_mongoose.model('table_collection', TableSchema);