const router = require('express').Router()
const Event = require('../models/EventModel')
const Employee = require('../models/EmployeeModel')
const { events } = require('../models/EventModel')
//const ObjectId = mongoose.Types.ObjectId;
/*

*/


//create and push event into employee document and check if date is available
router.post("/:employeeid", async(req, res)=>{
    const EmployeeId = req.params.employeeid
    const newEvent = new Event(req.body)    
        try {
                dates = []
                 newEvent.dates.forEach(el => {
                dates.push(el.date)
                });
                
            await Employee.findOneAndUpdate({_id:EmployeeId, 'events.dates.date':{$nin:[...dates]}}, {                
                $push:{events:newEvent}
            })
        } catch (err) {
            res.status(500).json(err)
        }
        res.status(200).json(newEvent)
    
})


//????????? to be checked - no clue what for is that
router.get("/event/:id", async (req, res)=>{

    try {
        const event = await Employee.findOne({'events._id':req.params.id}, {'events.$':true, '_id':false})        
        res.status(200).json(event.events[0])
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get summary of hours and number of ops having holiday per date
router.get("/countHols/:event/:shift/:day", async (req, res)=>{
    const shift = req.params.shift
    const event = req.params.event
    const day = parseInt(req.params.day)
    
    try {
        const events = await Employee.aggregate([
            {$match:{$and:[{ 'shiftName':shift},{'events.eventName':event},{'events.dates.date':day}, {'events.dates.update':false} ]}},

            {$unwind:'$events'},
            {$unwind:'$events.dates'},

            {$match:{
                $and:[{'events.eventName':event},{'events.dates.date':day}]
            }},

            {$group:{                
                _id: '$events.dates.date',
                count:{$sum:1},
                total: {$sum:'$events.dates.hours'}
            }}
            
        ])
        res.status(200).json(events[0])
    } catch (err) {
        res.status(500).json(err)
    }
})




// get number of holidays per day per shift
router.get("/find/:event/:shift/", async (req, res)=>{
    const shift = req.params.shift
    const event = req.params.event

    try {
        const events = await Employee.aggregate([
            {$match:{$and:[{ 'shiftName':shift},{'events.eventName':event}, {'events.dates.update':false}]}},

            {$unwind:'$events'},
            {$unwind:'$events.dates'},
            {$match:{'events.eventName':event}},
            {$group:{
                _id: '$events.dates.date',
                count:{$sum:1}
            }}
        ])
        res.status(200).json(events)
    } catch (err) {
        res.status(500).json(err)
    }
})



// updateEvent
router.put("/eventUpdate/:id/", async (req,res)=>{
    const id = req.params.id
    const eventId = req.params.eventId
try {
    const employee = await Employee.findOneAndUpdate({"events._id": req.params.id},
       { $set:{"events.$.confirmed":req.body.confirmed,
                "events.$.eventName":req.body.eventName}
    }
    )
    res.status(200).json(employee)
} catch (err) {
    res.status(500).json(err)
}
})

//update comments
router.put("/descUpdate/:id/", async (req,res)=>{
    const eventId = req.params.eventId
try {
    const employee = await Employee.findOneAndUpdate({"events._id": req.params.id},
       { $push:{"events.$.desc":req.body.desc}
    },{new:true}
    )
    res.status(200).json(employee)
} catch (err) {
    res.status(500).json(err)
}
})


// update Date
router.put("/dateUpdate/:id/:dateId", async (req,res)=>{
    const id = req.params.id
    const dateId = req.params.dateId
try {
    const employee = await Employee.findOneAndUpdate({"events._id": req.params.id},
        {$set:{"events.$[e1].dates.$[e2].update":req.body.update,
        "events.$[e1].dates.$[e2].halfDay":req.body.halfDay,
        "events.$[e1].dates.$[e2].hours":req.body.hours
        //"events.$[e1].dates.$[e2].date":req.body.date     
    }},
        {arrayFilters:[{"e1._id":req.params.id},{"e2._id":req.params.dateId}]}
    )
    /*
    const employee = await Employee.findOne({"events._id": req.params.id})
     const date = employee.events.id(id).dates.id(dateId)
     date.update = req.body.update
     date.halfDay = req.body.halfDay
     date.hours = req.body.hours
     const updatedDate = await employee.save()*/
    
    res.status(200).json(employee)
    
} catch (err) {
    res.status(500).json(err)
}
})

//add Date to dates array
router.put("/addAbsence/:id/", async (req,res)=>{
try {  
    const employee = await Employee.findOneAndUpdate({"events._id": req.params.id, 'events.dates.date':{$nin:[req.body.date]}},
        {$set:{'events.$.confirmed':false},
        $push:{"events.$.dates":req.body }}
    )
    res.status(200).json(employee)
    
} catch (err) {
    res.status(500).json(err)
}
})


// delete Date from dates array
router.put("/dateDelete/:id/:dateId", async (req,res)=>{
    const id = req.params.id
    const dateId = req.params.dateId
try {
    const employee = await Employee.findOne({"events._id": req.params.id}/*,
    {new:true}    */
    )    
    const date = employee.events.id(id).dates.id(dateId)
    await date.remove()
    const event = employee.events.id(id)    
    const updated = await employee.save()
    res.status(200).json(updated)    
} catch (err) {
    res.status(500).json(err)
}
})

// delete event from employee document
router.put("/deleteEvent/:id/", async (req,res)=>{
    const id = req.params.id
    const eventId = req.params.eventId
try {
    const employee = await Employee.findOneAndUpdate({"events._id": req.params.id},
       { $pull:{"events":{"_id":id}
    }}
    )
    res.status(200).json(employee)
} catch (err) {
    res.status(500).json(err)
}
})

//Get summary of hours and number of ops having holiday per date
router.get("/countHols/:contract/:day", async (req, res)=>{
    const contract = req.params.contract
    const event = req.params.event
    const day = parseInt(req.params.day)
    const contr = ['holiday','absence','aaup']
    try {
        const events = await Employee.aggregate([
            {$match:{$and:[{ 'contract':contract},{'events.eventName':{$in:contr}},{'events.dates.date':day}, {'events.dates.update':false} ]}},            
            {$unwind:'$events'},
            {$unwind:'$events.dates'},
            {$match:{
                $and:[{'events.eventName':{$in:contr}},{'events.dates.date':day}]
            }},            
            {$group:{                
                _id:{shift:'$shiftName',event:'$events.eventName'},
                count:{$sum:1},
                hours: {$sum:'$events.dates.hours'},                
            }},
            {$group:{
                _id:'$_id.shift',
                events:{$push:{
                    event:'$_id.event',
                    countShift:'$count',
                    hoursShift:'$hours'
                }},    
                total:{$sum:'$events.countShift'}            
            }},
            {$sort:{
                '_id':1
            }},            
            {$group:{
                _id:'Total',
                contract:{$push:{shift:'$_id',events:'$events'}},
                 
            }}, 
                
            {$addFields:{
                totalEmps:{$reduce:{
                    input:{$map:{
                                input:'$contract',
                                in:{$reduce:{
                                            input:'$$this.events',
                                            initialValue:0,
                                            in:{$add:['$$value','$$this.countShift']}
                                            }
                                    }
                                }
                            },
                    initialValue:0,
                    in:{$add:['$$value','$$this']}
                }},
                totalHours:{$reduce:{
                    input:{$map:{
                                input:'$contract',
                                in:{$reduce:{
                                            input:'$$this.events',
                                            initialValue:0,
                                            in:{$add:['$$value','$$this.hoursShift']}
                                            }
                                    }
                                }
                            },
                    initialValue:0,
                    in:{$add:['$$value','$$this']}
                }}
            }},
            
            
            
        ])
        res.status(200).json(events[0])
    } catch (err) {
        res.status(500).json(err)
    }
})




module.exports = router



/*
//Update
router.put('/:id', async(req, res)=>{        
        try{
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})
            res.status(200).json(updatedEvent)
        } catch(err){
            res.status(500).json(err)
        }
})

//Delete
router.delete('/:id/:employeeid', async(req, res)=>{  

    const EmployeeId = req.params.employeeid
    
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id)
        try {
            await Employee.findByIdAndUpdate(EmployeeId, {
                $pull:{events: req.params.id}   
            })
        } catch (err) {
            res.status(500).json(err)
        }
        res.status(200).json('event has been deleted')
    } catch (err) {
        res.status(500).json(err)
    }
})


router.get("/find/hols/:shift/", async (req, res)=>{
    const shift = req.params.shift
    try {
        
        const events = await Employee.find({'shiftName':shift, 'events.eventName':'holiday'}, {'events.dates.date':1}) 
        
        res.status(200).json(events)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post("/:employeeid", async(req, res)=>{
    const EmployeeId = req.params.employeeid
    const newEvent = new Event(req.body)
    try {
        const savedEvent = await newEvent.save()
        try {
            await Employee.findByIdAndUpdate(EmployeeId, {
                $push:{events:savedEvent._id}
            })
        } catch (err) {
            res.status(500).json(err)
        }
        res.status(200).json(savedEvent)
    } catch (err) {
        res.status(500).json(err)
    }
})

*/