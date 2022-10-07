import axios from "axios";
import useFetch from "../hooks/useFetch";
import Modal from '../Calendar/Modal';

import { useState } from "react";
import { capitals, dateDiff, formatDate} from "../Utils.js/Utils";

const DisplayEmpData = ({personalData, handleDeleteEmp, refetchData, patterns}) => {

    const {data:contracts} = useFetch("/contracts")   

    const [editMode, setEditMode] = useState('')
    const [name, setName] = useState()
    const [skills, setSkills] = useState([])
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)


const reset =()=>{
    setEditMode('')
    setName()
    setSkills([]);
}





const checkToBeConfirmed = ()=>{
    const events = personalData.events.filter(event=>{return event.confirmed===false&&event.eventName!=='decline'}) 
    return events
}
const checkUpdates = ()=>{
    const names = ['holiday', 'aaup', 'absence']
    let data=[]
    personalData.events.forEach(event=>{
        const date = event.dates.filter(date=>date.update===true&&names.some(el=>el===event.eventName))  
        if(date.length>0){
            date.forEach(d=>{
                data.push({...d, 'eventId': event._id})
            })
        }            
    })
    return data
}


const updateData = async(e, url)=>{
    const prop = e.target.dataset.name
    const value = e.target.dataset.value==='skillset'?skills:e.target.dataset.value
    try {
        await axios.put(url+personalData._id, {[prop]:value})
    } catch (err) {        
    }
    refetchData()
    reset()
}

const handleConfirm = async(id)=>{
    try {
        await axios.put('/events/eventUpdate/'+id, {confirmed: true})
    } catch (err) {        
    }
    refetchData()
}

const handleUpdate = async(date)=>{
    const counter = personalData.events.filter(el=>el._id===date.eventId)
   if(date.hours!==0){
    try {
        await axios.put('/events/dateUpdate/'+date.eventId+'/'+date._id, {update: false, hours: date.hours, halfDay: date.halfDay})

    } catch (err) {        
    }}

    else if(counter[0].dates.length===1&&date.hours===0){
        try {
            await axios.put('/events/deleteEvent/'+date.eventId)
        } catch (err) {        
        }
    }

    else if(date.hours===0){
        //console.log(date)
        try {
            await axios.put('/events/dateDelete/'+date.eventId+'/'+date._id)
        } catch (err) {        
        }
    }
    refetchData()
    
}

const optionNames = (data, prop)=>{
    let arr=[]
    contracts.forEach((el)=>{
        if(el.name===data){
            arr=el[prop]
        }
    })
    return arr
}

const handleCheckbox =(e)=>{
    let updatedList=[];
    if (e.target.checked) {
    updatedList = [...skills, e.target.value];
    } else {
    updatedList.splice(skills.indexOf(e.target.value), 1);
    }
    setSkills(updatedList);
}

const handleCloseConfirmDeleteModal=()=>{
    setConfirmDeleteModal(false)
}

    return ( 
        <>
        <div className="details">
                <div className="personalInfo card">                    
                    {/*name*/}
                    <h2>Personal Info <i onClick={()=>setConfirmDeleteModal(true) } className="fa-solid fa-trash"></i></h2>
                    <div className="inputs">
                    <label>Name:</label>
                    <input type="text" 
                    disabled={editMode!=='name'?true:false}                                       
                    value={editMode==='name'&&(name||name==='')?name:capitals(personalData.name)}                   
                    onChange={(e)=>setName(e.target.value)}
                    />
                    {editMode==='name'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='name' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('name')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='name'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}                    
                    </div>

                    {/*surname*/}
                    <div className="inputs">
                    <label>Surname:</label>
                    <input type="text" 
                    disabled={editMode!=='surname'?true:false}                                       
                    value={editMode==='surname'&&(name||name==='')?name:capitals(personalData.surname)}   
                    onChange={(e)=>setName(e.target.value)}
                    />
                    {editMode==='surname'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='surname' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('surname')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='surname'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}
                    </div>

                    {/*employee No*/}
                    {/*<div className="inputs">
                    <label>Employee No:</label>
                    <input type="text" 
                    disabled={editMode!=='employeeNo'?true:false}                                       
                    value={editMode==='employeeNo'&&(name||name==='')?name:personalData.employeeNo}   
                    onChange={(e)=>setName(e.target.value)}
                    />
                    {editMode==='employeeNo'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='employeeNo' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('employeeNo')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='employeeNo'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}
                    </div>*/}

                </div>
                <div className="employementInfo card">
                    <h2>Employement Info</h2>
                    <div className="inputs">  
                    {/*Employeer -FTE or Agency */}                 
                    <label>Employeer:</label>
                    <select 
                    disabled={editMode!=='employeer'?true:false}                                       
                    value={name&&editMode==='employeer'?name:personalData.employeer}     
                    onChange={(e)=>setName(e.target.value)} 
                    required
                    >      
                    {/*<option disabled>{name==='employeer'||personalData.employeer}</option>*/}                               
                    <option value="FTE">FTE</option>
                    <option value="MACH">MACH</option>
                    <option value="J&T">J&T</option>             
                    </select>
                    {editMode==='employeer'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='employeer' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('employeer')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='employeer'&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                    </div>

                    {/*start Date */}
                    <div className="inputs">
                    <label>Employeed:</label>
                    <input type="date" 
                    disabled={editMode!=='startDate'?true:false}
                    value={name&&editMode==='startDate'?name:formatDate(personalData.startDate)}
                    onChange={(e)=>setName(e.target.value)}
                    />
                    {editMode==='startDate'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='startDate' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('startDate')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='startDate'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}
                    </div>
                    {/*Service length */}
                    <div>Service: <span>{dateDiff(personalData.startDate)}</span></div>

                    {/*Contract*/}   
                    <div className="inputs"> 
                    <label>Contract:</label>
                    <select 
                    disabled={editMode!=='contract'?true:false}                                       
                    value={name&&editMode==='contract'?name:personalData.contract}     
                    onChange={(e)=>setName(e.target.value)} 
                    required
                    >      
                    {/*<option>{name==='contract'||personalData.contract}</option>*/}                               
                    {contracts&&contracts.map((el, index)=>{                        
                        return <option key={index} value={el.name}>{el.name}</option>
                    })}              
                    </select>
                    {editMode==='contract'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='contract' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('contract')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='contract'&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                    </div>

                    {/*shift Name */}
                    <div className="inputs">                   
                    <label>Shift:</label>
                    <select 
                    disabled={editMode!=='shiftName'?true:false}                                       
                    value={name&&editMode==='shiftName'?name:personalData.shiftName}     
                    onChange={(e)=>setName(e.target.value)} 
                    required
                    >      
                    {/*<option disabled>{name==='shiftName'||personalData.shiftName}</option>*/}                               
                    {contracts&&optionNames(personalData.contract, 'shifts').map((el, index)=>{                        
                        return <option  key={index} value={el}>{el}</option>
                    })}              
                    </select>
                    {editMode==='shiftName'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='shiftName' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('shiftName')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='shiftName'&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                    </div>

                    {/*Pattern*/}   
                    <div className="inputs"> 
                    <label>Pattern:</label>
                    <select 
                    disabled={editMode!=='pattern'?true:false}                                       
                    value={name&&editMode==='pattern'?name:personalData.pattern}     
                    onChange={(e)=>setName(e.target.value)} 
                    required
                    >      
                    {<option>none</option>}                               
                    {patterns.map((el)=>{
                        return <option key={el._id} value={el.name}>{el.name}</option>
                    })}              
                    </select>
                    {editMode==='pattern'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='pattern' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('pattern')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='pattern'&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                    </div>

                    {/*shiftHours*/}
                    <div className="inputs">
                    <label>Shift hours:</label>
                    <input type="number" 
                    step=".25"
                    min='0'
                    max='11.5'
                    disabled={editMode!=='shiftHours'?true:false}                                       
                    value={editMode==='shiftHours'&&(name||name==='')?name:personalData.shiftHours}                   
                    onChange={(e)=>setName(e.target.value)}
                    />
                    {editMode==='shiftHours'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='shiftHours' data-value={name}  className="fa-solid fa-circle-check"></i>}
                    {editMode===''&&<i onClick={()=>setEditMode('shiftHours')} className="fa-solid fa-pen-to-square"></i>}
                    {editMode==='shiftHours'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}                    
                    </div>

                    <div className="inputs">
                        <label>Entitlement:</label>
                        <input type="number" 
                        step=".25"
                        min='0'
                        max='400'
                        disabled={editMode!=='entitlement'?true:false}  
                        value={editMode==='entitlement'&&(name||name==='')?name:personalData.entitlement}                   
                        onChange={(e)=>setName(e.target.value)}
                        />
                        {editMode==='entitlement'&&<i  onClick={(e)=>updateData(e, '/employees/')} data-name='entitlement' data-value={name}  className="fa-solid fa-circle-check"></i>}
                        {editMode===''&&<i onClick={()=>setEditMode('entitlement')} className="fa-solid fa-pen-to-square"></i>}
                        {editMode==='entitlement'&&<i onClick={()=>reset()} className="fa-solid fa-xmark"></i>}                    
                        </div>
                        <div>Hrs booked: <span>{personalData.holidaysBooked}</span></div>
                        <div>Hrs left: <span>{personalData.holidaysLeft}</span></div>
                        <div>Absences: <span>{personalData.absences}</span></div>
                        
                    </div>
                
                
                <div className="skillsInfo card">
                    {/*Skills*/}
                    <h2>Skills
                        {editMode===''&&<i onClick={()=>setEditMode('skillset')} className="fa-solid fa-pen-to-square"></i>}
                        {editMode==='skillset'&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                        {editMode==='skillset'&&<i  onClick={(e)=>updateData(e, '/employees/skills/')} data-name='skills' data-value='skillset'  className="fa-solid fa-circle-check"></i>}                    
                    </h2>
                    
                    {personalData.skills&&personalData.skills.map((el)=>(
                        <div key={el}>{el}
                        {editMode===''&&<i onClick={()=>setEditMode(el)} className="fa-solid fa-pen-to-square"></i>}
                        {editMode===el&&<i onClick={()=>setEditMode('')} className="fa-solid fa-xmark"></i>}
                        {editMode===el&&<i  onClick={(e)=>updateData(e,'/employees/deleteskills/')} data-name='skills' data-value={el}  className="fa-solid fa-circle-check"></i>}   
                        </div>
                    ))}

                    {editMode==='skillset'&&<div disabled className="checkboxes">
                                {contracts&&optionNames(personalData.contract, 'skills').map((el, index)=>{
                                    //return<label key={index}>{el}<input onChange={handleCheckbox} value={el} type="checkbox"/></label>
                                    return !personalData.skills.find(item=>item===el)&&<label key={index}>{el}<input onChange={handleCheckbox} value={el} type="checkbox"/></label>                   
                    })} 
                    </div>}
                </div>
                
                {(checkToBeConfirmed().length>0||checkUpdates().length>0)&&<div className="EventInfo card">
                    <h2>Events</h2>                    
                    <div className="holidays">{
                            checkToBeConfirmed().map((el)=>{
                                const index = el.dates.length-1
                               return <div className="comfirmHols" key={el._id}>{el.eventName+": "+formatDate(el.dates[0].date)+" - "+ formatDate(el.dates[index].date)}<i onClick={()=>handleConfirm(el._id)} className={"fa-solid fa-circle-check "+el.eventName}></i></div>
                            })
                        
                    }</div>
                    <div className="holidays">{
                        checkUpdates().map(el=>{
                            return <div key={el._id}>{el.halfDay==='fd'?'cancelled':el.halfDay==='am'?'pm cancelled': 'am cancelled'} on {formatDate(el.date)}<i onClick={()=>handleUpdate(el)} className={"fa-solid fa-circle-check "}></i></div>
                        })
                    }</div>

                </div>} 
                                               
            </div>
            {confirmDeleteModal&&<Modal  handleClose={handleCloseConfirmDeleteModal}>
            <div className='modalForm'>
                <p className="confirmDelete">Confirm to <span>delete</span> <b>{capitals(personalData.name)} {capitals(personalData.surname)}</b> <button onClick={handleDeleteEmp}><i className="fa-solid fa-trash"></i></button></p> 
            </div>
            </Modal>}
        </>
     );
}
 
export default DisplayEmpData;