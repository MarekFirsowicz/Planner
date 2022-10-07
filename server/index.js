const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const employeeRoute = require('./routes/employees')
const eventRoute = require('./routes/events')
const contractRoute = require('./routes/contracts')
const patternRoute = require('./routes/patterns')
const calendarRoute = require('./routes/calendars')






dotenv.config()
app.use(express.json())
// connect to db
mongoose.connect('mongodb://localhost:27017/holiday_planner')//  process.env.MONGO_URL
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database.`);
    })


app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/employees', employeeRoute)
app.use('/api/events', eventRoute)
app.use('/api/contracts', contractRoute)
app.use('/api/patterns', patternRoute)
app.use('/api/calendars', calendarRoute)





//listen to server port 8000
app.listen(8000,()=>{
    console.log('Backend is running')
})

