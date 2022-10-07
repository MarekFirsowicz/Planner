const router = require('express').Router()
const Calendar = require('../models/CalendarModel')

//Create Calendar record
router.post("/", async(req, res)=>{
    const newCalendar = new Calendar(req.body)
    try{
        const savedCalendar = await newCalendar.save()
        res.status(200).json(savedCalendar)
    } catch(err){
        res.status(500).json(err)
    }
})

//Get all Calendar records
router.get("/", async (req, res)=>{
    try {
        const calendars = await Calendar.find()
        res.status(200).json(calendars)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router