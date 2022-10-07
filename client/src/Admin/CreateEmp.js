import axios from "axios";
import { useState } from "react";
import useFetch from "../hooks/useFetch";


const CreateEmp = () => {
    const [contract, setContract] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [employeer, setEmployeer] = useState('')
    const [employeeNo, setEmployeeNo] = useState('')
    const [shiftName, setShift] = useState('')
    const [startDate, setStartDate] = useState('')
    const [entitlement, setEntitlement] = useState('')
    const [pattern, setPattern] = useState('')
    const [shiftHours, setShiftHours] = useState('')
    const [skills, setSkills] = useState([])

    const [response, setResposne] = useState('')

    const {data:patterns} = useFetch("/patterns/name")
    const {data:contracts} = useFetch("/contracts")
       

    const optionNames = (data, prop)=>{
        let arr=[]
        contracts.forEach((el)=>{
            if(el.name===data){
                arr=el[prop]
            }
        })
        return arr.sort()
    }


    //const [isPending, setIsPending] = useState(false)
    //const [disabled, setDisabled] = useState(true)
    //const handleDisable = () =>{setDisabled(!disabled)    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        //const startDate = new Date(start).getTime()
       const newEmployee = {contract, name, surname, employeer, employeeNo, pattern, startDate, entitlement, shiftName, shiftHours, skills, events:[]}
        try {
            const res = await axios.post("/employees",newEmployee)
            console.log(res.data)
            setResposne(res.data)
        } catch (err) {
            console.log(err)
            setResposne('Something went wrong')
        }
            setContract('')
            setName('')
            setSurname('')
            setEmployeeNo('')
            setShift('')
            setStartDate('')
            setEntitlement('')
            setPattern('')
            setShiftHours('')
            setSkills([])
            document.querySelectorAll('input[type=checkbox]').forEach(el=>el.checked=false)
    }

    const handleCheckbox =(e)=>{        
        let updatedList = [...skills];
        if (e.target.checked) {
        updatedList = [...skills, e.target.value];
        } else {
        updatedList.splice(skills.indexOf(e.target.value), 1);
        }
        setSkills(updatedList);
    }


    return ( 
        <div className="create">
            <h2>Employee</h2>
            <form onSubmit={handleSubmit}>
                <label>Contract:</label>
                <select            
                value={contract}                
                onChange={(e)=>setContract(e.target.value)}
                required
                >
                <option disabled value="">Pick Contract</option>
                {contracts&&contracts.map((el)=>{
                        return <option key={el._id} value={el.name}>{el.name}</option>
                    })}
                </select>
                <label>Name:</label>
                <input type="text"                
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
                />
                <label>Surname:</label>
                <input type="text" 
                value={surname}
                onChange={(e)=>setSurname(e.target.value)}
                required
                />
                <label>Employeer:</label>
                 <select 
                value={employeer}
                onChange={(e)=>setEmployeer(e.target.value)}
                required
                >
                <option disabled value="">Pick Employeer</option>
                <option value="FTE">FTE</option>
                <option value="MACH">MACH</option>
                <option value="J&T">J&T</option>                            
                </select>
                <label>EmployeeNo:</label>
                <input type="number" 
                value={employeeNo}
                onChange={(e)=>setEmployeeNo(parseInt(e.target.value))}
                
                />
                <label>Shift:</label>

                <select 
                value={shiftName}
                onChange={(e)=>setShift(e.target.value)}
                required
                >
                <option disabled value="">Pick Shift</option>  
                {contract&&optionNames(contract, 'shifts').map((el, index)=>{
                    return <option key={index} value={el}>{el}</option>
                })}              
                </select>

                <label>Pattern:</label>
                <select
                    required
                    value={pattern}
                    onChange={(e)=>setPattern(e.target.value)}>
                    <option disabled value="">Pick Pattern</option>
                    {patterns&&patterns.map((el)=>{
                        return <option key={el._id} value={el.name}>{el.name}</option>
                    })}
                </select>
                <label>StartDate:</label>
                <input type="date" 
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                required
                />
                <label>Entitlement:</label>
                <input type="number" 
                
                step=".25"
                min='0'
                max='500'
                value={entitlement}
                onChange={(e)=>setEntitlement(parseFloat(e.target.value))}
                required
                />
                <label>Shift Hours:</label>
                <input type="number" 
                step=".25"
                min='0'
                max='11.5'
                value={shiftHours}
                onChange={(e)=>setShiftHours(parseFloat(e.target.value))}
                required
                />

                <div className="checkboxes">
                    {contract&&optionNames(contract, 'skills').map((el, index)=>{
                        return <label key={index}>{el}<input onChange={handleCheckbox} value={el} type="checkbox" /></label>
                    })} 
                </div>
                {response&&<div>{response}</div>}
                {/*!isPending&&*/<button>Add Record</button>}
                {/*isPending &&<button>Adding record...</button>*/}
            </form>
            {/*<button onClick={handleDisable}>edit</button>*/}
        </div>
    );
}
 
export default CreateEmp;