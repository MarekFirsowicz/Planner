const mongoose = require('mongoose')

const PatternSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
    },
    type: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    daysOn: {
        
    },
    daysOff: {
        
    },
    days: {
        type: Boolean,
        required: true
    },
    mixed:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("pattern", PatternSchema)