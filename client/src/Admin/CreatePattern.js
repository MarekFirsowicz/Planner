import { useState } from "react"
import axios from "axios";
import useFetch from '../hooks/useFetch';
import { formatDate } from "../Utils.js/Utils";


const CreatePattern = () => {
    const{data, refetchData} = useFetch("/patterns/")
    const [edit, setEdit] = useState('')

    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [daysOn, setDaysOn] = useState('')
    const [daysOff, setDaysOff] = useState('')
    const [startDate, setStartDate] = useState('')
    const [days, setDays] = useState(false)
    const [mixed, setMixed] = useState(false)


    const reset =()=>{
        setName('')
        setType('')
        setDaysOn('')
        setDaysOff('')
        setStartDate('')
        setDays(false)
        setMixed(false)
        setEdit('')
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()        
        const newPattern = {name, type, daysOn, daysOff, startDate:new Date(startDate).setHours(0,0,0,0), days, mixed}

        if(!edit&&daysOn){
            try {
                await axios.post("/patterns/",newPattern)
            } catch (err) {
                console.log(err)
            }            
        } 

        if(edit&&daysOn){
            try {
                await axios.put("/patterns/"+edit,newPattern)
            } catch (err) {
                console.log(err)
            }
        }  
        reset()
        refetchData()
           
    }

    const handleChangeType=(e)=>{
        setDaysOn('')
        setDaysOff('')        
        setType(e.target.value)
    }
    
    const handleEdit=async(e,pattern)=>{
        e.preventDefault()  
        setName(pattern.name)
        setType(pattern.type)
        setDaysOn(pattern.daysOn)
        setDaysOff(pattern.daysOff)
        setStartDate(formatDate(pattern.startDate))
        setDays(pattern.days)
        setMixed(pattern.mixed)
        setEdit(pattern._id)
        const checkboxes = await pattern.type==='weekly'?document.querySelectorAll('input[name="check"]'):null
        checkboxes&&checkboxes.forEach(el=>{
            if(pattern.daysOn.includes(parseInt(el.value))){
                el.checked = true
            }
        })
    }

    const handleDelete=async()=>{
        try {
            await axios.delete("/patterns/"+edit)
        } catch (err) {
            console.log(err)
        }
        refetchData()
        reset()
    }

    const handleCheckbox =(e)=>{        
        const days = [0,1,2,3,4,5,6]
        let updatedList = [...daysOn];
        if (e.target.checked) {
        updatedList = [...daysOn, parseInt(e.target.value)];
        } else {
        updatedList.splice(daysOn.indexOf(e.target.value), 1);
        }
        const offDays = days.filter(el=>!updatedList.includes(el))
        setDaysOn(updatedList.sort());
        setDaysOff(offDays.sort())
    }

    const showShift= (days, mixed)=>{
        if(mixed){
            return 'days/nights'
        }
        else if(days){
            return 'days only'
        }
        else if(!days)
        {
            return 'nights only'
        }
         else{return 'none'}
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']    
    
    return ( 
        <div className="panel">
            <div>
                <div className="create">
                    <h2>Pattern<span>{edit&&<i onClick={handleDelete} className="fa-solid fa-trash"></i>}<i onClick={reset} className="fa-solid fa-xmark"></i></span></h2>
                    <form onSubmit={handleSubmit}>
                        <label>Name:</label>
                            <input type="text"                
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            required
                            />
                        
                        <label>Type:</label>
                            <select 
                            value={type}
                            onChange={(e)=>handleChangeType(e)}
                            required
                            >
                            <option disabled value="">Pick Type</option>
                            <option value="shift">Shift</option>
                            <option value="weekly">Weekly</option>
                            </select>

                        <label>StartDate:</label>
                            
                            <input type="date" 
                            value={startDate}
                            onChange={(e)=>setStartDate(e.target.value)}
                            required
                            />
                        <label>Shift starts on Days:
                            <input
                            type="checkbox"
                            checked={days}
                            onChange={(e)=>setDays(value => !value)}
                            />
                        </label> 
                            

                        <label>Mixed shift: 
                            <input
                            type="checkbox"
                            checked={mixed}
                            onChange={(e)=>setMixed(value => !value)}
                            />
                        </label>
                            

                        {type==='shift'&&<>
                        <label>Days On:</label>
                            <input type="number" 
                            min='1'
                            max='6'
                            value={daysOn}
                            onChange={(e)=>setDaysOn(parseInt(e.target.value))}
                            required
                            />
                        
                        <label>Days Off:</label>
                            <input type="number" 
                            min='1'
                            max='6'
                            value={daysOff}
                            onChange={(e)=>setDaysOff(parseInt(e.target.value))}
                            required
                            />
                        </>}
                        

                    {type==='weekly'&&<div className="checkboxes" >
                        <label >Mon<input  onChange={handleCheckbox} value={1} type="checkbox" name="check"  /></label>
                        <label >Tue<input onChange={handleCheckbox} value={2} type="checkbox" name="check"  /></label>
                        <label >Wed<input onChange={handleCheckbox} value={3} type="checkbox" name="check" /></label>
                        <label >Thu<input onChange={handleCheckbox} value={4} type="checkbox" name="check" /></label>
                        <label >Fri<input onChange={handleCheckbox} value={5} type="checkbox" name="check" /></label>
                        <label >Sat<input onChange={handleCheckbox} value={6} type="checkbox" name="check" /></label>
                        <label >Sun<input onChange={handleCheckbox} value={0} type="checkbox" name="check" /></label>
                    </div>}
                    {/*!isPending&&*/<button>{edit?'Update':'Add Record'}</button>}
                    </form>
                    
                </div>
            </div> 
            <div className="patterns">
            {data&&data.map((pattern)=>{
                return <div onClick={(e)=>handleEdit(e,pattern)} className="pattern" key={pattern._id}>
                    <p>name: <span>{pattern.name}</span></p>
                    <p>start: <span>{formatDate(pattern.startDate)}</span></p>
                    <p>shift:<span>{Array.isArray(pattern.daysOn)?pattern.daysOn.map(((el)=>(<span key={el}>{weekDays[el]},</span>))):`${pattern.daysOn} on/${pattern.daysOff} off`}</span></p>
                    <p>mixed: <span>{showShift(pattern.days, pattern.mixed)}</span></p>
                </div>
            })}
            </div>
        </div>      
    );
}
 
export default CreatePattern;