const router = require('express').Router()
const Pattern = require('../models/PatternModel')

//Create
router.post("/", async(req, res)=>{
    const newPattern = new Pattern(req.body)
    try{
        const savedPattern = await newPattern.save()
        res.status(200).json(savedPattern)
    } catch(err){
        res.status(500).json(err)
    }
})

//Get all
router.get("/", async (req, res)=>{
    try {
        const patterns = await Pattern.find().sort('name')
        res.status(200).json(patterns)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get one by name
router.get("/pattern/", async (req, res)=>{
    const pattern  = req.query
    try {
        const patterns = await Pattern.findOne(pattern)
        res.status(200).json(patterns)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get name only
router.get("/name", async (req, res)=>{
    try {
        const patterns = await Pattern.find().sort('name').select('name')
        res.status(200).json(patterns)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Delete
router.delete('/:id', async(req, res)=>{        
    try{
        await Pattern.findByIdAndDelete(req.params.id)
        res.status(200).json('Record was deleted')
    } catch(err){
        res.status(500).json(err)
    }
})

//Upadte pattern
router.put('/:id', async(req, res)=>{        
    try{
        const updatedPattern = await Pattern.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedPattern)
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router