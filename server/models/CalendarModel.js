const mongoose = require('mongoose')

const CalendarSchema = new mongoose.Schema({
    
    startCalendar: {
        type: Date,
        required: true,
        unique: true,
    },
    startClipperWeeks: {
        type: Date,
        required: true,
    },
    weekNo: {
        type: Number,
        required: true,
        trim: true,
    },
})

module.exports = mongoose.model("calendar", CalendarSchema)