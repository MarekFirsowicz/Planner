const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accessLvl:{
        type:Number,
        default: 1,
    },
    contract: {
        type: String,
        uppercase: true,
    },
    shifts: {
        type: Array,
        uppercase: true,
    },
})

module.exports = mongoose.model("user", UserSchema)