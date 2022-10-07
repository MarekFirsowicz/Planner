const mongoose = require('mongoose'), Schema = mongoose.Schema
const event = require ('./EventModel').schema
/*
const EventModel = new mongoose.Schema({
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
        type:String,
        default: null,
    },
    dates:[{date:Number, hours:Number, halfDay:String}]
},{timestamps:true})
*/
const EmployeeSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    employeer:{
        type: String,
        required: true,
        uppercase: true
    },
    employeeNo: {
        type: Number,
        trim: true,
        default:'',
    },
    startDate: {
        type: Date,
        required: true
    },
    contract: {
        type: String,
        required: true,
        uppercase: true,
    },
    shiftName: {
        type: String,
        required: true,
        uppercase: true,
    },
    pattern: {
        type: String,
        required: true,
        uppercase: true,
    },
    shiftHours: {
        type: Number,
        required: true,
        trim: true,
    },
    entitlement: {
        type: Number,
        required: true,
        trim: true,
    },
    skills:[{type: String, uppercase: true}],
    events:[event]

})

EmployeeSchema.index({name:1, surname:1}, {unique: true});
//const event = mongoose.model('event', EventModel)
module.exports = mongoose.model("employee", EmployeeSchema)