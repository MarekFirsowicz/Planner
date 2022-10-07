const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
    },
    bookedBy: {
        type: String,
        default: null,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    confirmedBy: {
        type: String,
        default: null,
    },
    desc:{
        type:Array,
        default: null,
        trim: true,
    },
    dates:[{date:Number, hours:Number, halfDay:String, update:{
        type:Boolean,
        default: false,
    } }]
},{timestamps:true})

module.exports = mongoose.model("event", EventSchema)