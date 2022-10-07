const router = require('express').Router()
const { mongo } = require('mongoose')
const Employee = require('../models/EmployeeModel')
const {ObjectId} = require('mongodb')

//const Event = require('../models/EventModel')

//mongodb snippets ********************************************
const hildayBookedFields = {$addFields:{               
    holidaysBooked:{                    
        $reduce:{
            input:
            {                        
                $map:{
                    input: {$filter:{
                        input: '$events',
                        as: 'ev',
                        cond:{$eq:['$$ev.eventName', 'holiday']}
                    }},
                    as: 'event',
                    in: {              
                            $reduce:{
                                input:'$$event.dates',
                                initialValue:0,
                                in:{
                                    $add:[
                                        '$$value',
                                        '$$this.hours'
                                    ]
                                }
                            } 
                        }
                    }
            } ,                        
            initialValue:0,
            in:{
                $add:[
                    '$$value',
                    '$$this'
                ]
            }
        }
    },
    absences: {$size:{$filter:{
        input: '$events',
        cond:{$eq:['$$this.eventName', 'absence']}
    }}},

    confirmHoliday:{$size:{$filter:{
        input: '$events',
        cond:{$and:[{$eq:['$$this.eventName', 'holiday']}, {$eq:['$$this.confirmed',false]}]}
    }}},

    confirmAbsence:{$size:{$filter:{
        input: '$events',
        cond:{$and:[{$eq:['$$this.eventName', 'absence']}, {$eq:['$$this.confirmed',false]}]}
    }}},

    confirmAaup:{$size:{$filter:{
        input: '$events',
        cond:{$and:[{$eq:['$$this.eventName', 'aaup']}, {$eq:['$$this.confirmed',false]}]}
    }}},
    
    confirmCancel:{$reduce: {
        input:{
            $map:{
                input: '$events',
                as:'ev',
                in:{
                    $size:
                    {$filter:{
                        input: '$$ev.dates',
                        as:'date',
                        cond:{$eq:['$$date.update', true]}
                    }}
                }
            }
        },
        initialValue:0,
        in:{
            $add:[
                '$$value',
                '$$this'
            ]
        }
    }
    },        
    }}

const holidaysLeftField = {$addFields:{
    holidaysLeft: {$subtract:['$entitlement', '$holidaysBooked']},                
    }}

const lookupPatternWeeklyHours = {
    $lookup: {
        from: "patterns",
        let: { hours: '$shiftHours'},
        localField: "pattern",
        foreignField: "name",
        pipeline:[
            {$project:{
                rotationHours:{
                    $cond:{
                        if:{ $isArray: "$daysOn" },
                        then: {$multiply:['$$hours',{$size:'$daysOn'}]},
                        else:{$multiply: ['$$hours','$daysOn']}
                    }
                }
            }
                
            }
        ],
        as: "weekHours"
    }
    }

const mergeDocs={
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$weekHours", 0 ] }, "$$ROOT" ] } }
    }
//end of mongodb snippets *********************************






//Create - Add Employee Record to DB
router.post("/", async(req, res)=>{
        const newEmployee = new Employee(req.body)
        try{
            const savedEmployee = await newEmployee.save()
            res.status(200).json('Record has been added')
        } catch(err){
            res.status(500).json(err)
        }
})

//Update Employee record
router.put('/:id', async(req, res)=>{        
        try{
            const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})
            res.status(200).json(updatedEmployee)
        } catch(err){
            res.status(500).json(err)
        }
})


//Update Employee's skill array
router.put('/skills/:id', async(req, res)=>{        
    try{
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id,{
            $push:req.body
        },{new:true})
        res.status(200).json(updatedEmployee)
    } catch(err){
        res.status(500).json(err)
    }
})

//Delete Employee's skill from array
router.put('/deleteskills/:id', async(req, res)=>{        
    try{
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id,{
            $pull: req.body
        },{new:true})
        res.status(200).json(updatedEmployee)
    } catch(err){
        res.status(500).json(err)
    }
})

//Delete Employee record
router.delete('/:id', async(req, res)=>{        
    try{
        await Employee.findByIdAndDelete(req.params.id)
        res.status(200).json('Record was deleted')
    } catch(err){
        res.status(500).json(err)
    }
})

//Get Employee record
router.get("/:id", async (req, res)=>{
    try {
        //const employee = await Employee.findById(req.params.id)
        const employee = await Employee.aggregate([
            {$match: {_id: ObjectId(req.params.id)}},
            hildayBookedFields,            
            holidaysLeftField,
            lookupPatternWeeklyHours,
            mergeDocs,            
            {$project:{weekHours:0}},
        ])      

        res.status(200).json(employee[0])
    } catch (err) {
        res.status(500).json(err)
    }
})


router.get("/test/test/", async (req, res)=>{
    const shifts = req.query.shifts.split(',')
    console.log(shifts)
    try {
        const employee = await Employee.aggregate([
            {$match: {shiftName:{$in:shifts}}},
            {$project:{events:0}},
            /*
            {$group:{
                _id:{shift:'$shiftName', emplr:'$employeer'},
                staff:{$push:"$$ROOT"} 
            }},
            */
            {$group:{
                _id:{shift:'$shiftName', emplr:'$employeer'},
                staff:{$push:"$$ROOT"} ,
                "shiftCount": { "$sum": 1 }
            }},

            {$group:{
                _id:'$_id.shift',
                staff:{
                    $push:{
                        employeer: '$_id.emplr',
                        employees: '$staff',
                        staffCount:"$shiftCount"
                    }
                },
                count:{'$sum':'$shiftCount'}
            }}
        ])      
        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json(err)
    }
})
/*
router.get("/test/test/:id", async (req, res)=>{
    try {
        const employee = await Employee.aggregate([
            {$match: {_id: ObjectId(req.params.id)}},
            hildayBookedFields,            
            holidaysLeftField,
            lookupPatternWeeklyHours,
            mergeDocs,
            
            {$project:{weekHours:0}},
            
        ])      

        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json(err)
    }
})

*/


//Get employees / implement pagination / implement queries
router.get("/tester/tester", async (req, res)=>{
    
    let query = {}
    const {page,limit,sorter, searcher, update,...others} = req.query    

    if(update&&searcher){
    query={$and:[{...others},{$or:[{'events.dates.update': true}, {'events.confirmed':false}]},{ surname: { $regex: searcher, $options: "i" } }]}
    }else if(update&&!searcher){
        query={$and:[{...others},{$or:[{'events.dates.update': true}, {'events.confirmed':false}]}]}
    }else if(searcher){
        query = {$and:[{...others},{ surname: { $regex: searcher, $options: "i" } }]}
    }
    else{
        query = {...others}
    }
    
    try {
        const pageNo = parseInt(page)
        const pageSize = parseInt(limit)
        const skip = (pageNo-1) * pageSize
        const countEmployees = await Employee.countDocuments(query)
        const employees = await Employee.find(query).skip(skip).limit(pageSize).sort(sorter).sort({employeer:1,surname:1, name:1})

        const total = countEmployees
        const pages = Math.ceil(total/pageSize)
        res.status(200).json({
            pagination:{
            page,
            pages,
            },            
            employees
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get employees by shift hol and date
router.get("/holiday/list/", async (req, res)=>{
    const {event, shift, date} = req.query
    try {
        const employees = await Employee.find({'shiftName':shift,'events.eventName':event, 'events.dates.date':date}).sort({employeer: 'asc',surname: 'asc', name: 'asc'})
        res.status(200).json(employees)
    } catch (err) {
        res.status(500).json(err)
    }
})



router.get("/", async (req, res)=>{
    let query = {}
    const {page,limit,sorter, update, searcher,...others} = req.query    

    if(update){
    query={$and:[{...others},{$or:[{'events.dates.update': true}, {'events.confirmed':false}]},{ surname: { $regex: searcher, $options: "i" } }]}
    }
    else{
        query = {$and:[{...others},{ surname: { $regex: searcher, $options: "i" } }]}
    }
    
    
    try {
        const pageNo = parseInt(page)
        const pageSize = parseInt(limit)
        const skip = (pageNo-1) * pageSize
        const countEmployees = await Employee.countDocuments(query)
        const total = countEmployees
        const pages = Math.ceil(total/pageSize)

        const employees = await Employee.aggregate([
            {$match:{...query}},            
            hildayBookedFields,            
            holidaysLeftField,
            lookupPatternWeeklyHours,
            mergeDocs,
            
            {$project:{events:0, weekHours:0}},
            
            {$sort: {[sorter]:1,surname:1, name:1}},
            {$skip: skip},
            {$limit: pageSize},   

            
        ])
        res.status(200).json({
            pagination:{
            page,
            pages,
            total
            },            
            employees
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router

