const mongoose = require('mongoose')

const ContractSchema = new mongoose.Schema({
    name: {
        type: String,
        uppercase: true,
        required: true,
        trim: true,
        unique: true,
    },
    shifts:[{type: String, uppercase: true, trim:true}],
    skills:[{type: String, uppercase: true, trim:true}],
})

module.exports = mongoose.model("contract", ContractSchema)