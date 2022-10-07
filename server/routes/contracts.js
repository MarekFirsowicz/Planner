const router = require('express').Router()
const Contract = require('../models/ContractModel')

//Create Contract record
router.post("/", async(req, res)=>{
    const newContract = new Contract(req.body)
    try{
        const savedContract = await newContract.save()
        res.status(200).json(savedContract)
    } catch(err){
        res.status(500).json(err)
    }
})

//Update Contract record
router.put('/:id', async(req, res)=>{        
    try{
        const updatedContract = await Contract.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedContract)
    } catch(err){
        res.status(500).json(err)
    }
})

//Get all Contract records
router.get("/", async (req, res)=>{
    try {
        const contracts = await Contract.find()
        res.status(200).json(contracts)
    } catch (err) {
        res.status(500).json(err)
    }
})


//Delete contract record
router.delete('/:id', async(req, res)=>{        
    try{
        await Contract.findByIdAndDelete(req.params.id)
        res.status(200).json('Record was deleted')
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router