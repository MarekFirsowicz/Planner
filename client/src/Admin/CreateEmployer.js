import { useEffect, useState, useRef } from "react"
import axios from "axios";
import useFetch from '../hooks/useFetch';



const CreateEmployer = () => {
    const{data, refetchData} = useFetch("/contracts/")

    const [name, setName] = useState('')
    const [shifts, setShifts] = useState([])
    const [skills, setSkills] = useState([])
    const [edit, setEdit] = useState('')

    const skillInput = useRef(null)
    const shiftInput = useRef(null)

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const contract = {name,shifts ,skills}
        if(edit){
            //console.log(edit, contract)
            try {
                await axios.put("/contracts/"+edit,contract)
            } catch (err) {
                console.log(err)
            }

        }else{
            try {
                await axios.post("/contracts",contract)
            } catch (err) {
                console.log(err)
            }
        }
            handleReset()
            refetchData()
        }

    const handleAddShift =async(e)=>{
        e.preventDefault()  
        if(shiftInput.current.value!==''){
            await setShifts((prevstate)=>[...prevstate, shiftInput.current.value])
        }       
        shiftInput.current.value=''
    }

    const handleAddSkill =async(e)=>{
        e.preventDefault()   
        if(skillInput.current.value!==''){
            await setSkills((prevstate)=>[...prevstate, skillInput.current.value])
        }     
        skillInput.current.value=''
    }

    const handleRemove=(setter, arr, skill)=>{
        let updatedList=[...arr];
        updatedList.splice(arr.indexOf(skill), 1);
        setter(updatedList)
    }

    const handleEdit=(e,contract)=>{
        e.preventDefault()  
        setName(contract.name)
        setShifts(contract.shifts.sort())
        setSkills(contract.skills.sort())
        setEdit(contract._id)
        //edit&&console.log(edit)
    }

    const handleDeleteEmplr=async()=>{
        //console.log(edit)
        try {
            await axios.delete("/contracts/"+edit)
        } catch (err) {
            console.log(err)
        }
        refetchData()
        handleReset()
    }

    const handleReset =()=>{
        setName('')
        setShifts([])
        setSkills([])
        setEdit('')
    }

    useEffect(()=>{
       //data&&console.log(data)
    },[data])

   

    return ( 
        <div className="panel">
            <div className="create">
            <h2>Contract <span>{edit&&<i onClick={handleDeleteEmplr} className="fa-solid fa-trash"></i>}<i onClick={handleReset} className="fa-solid fa-xmark"></i></span></h2>
                <form onSubmit={handleSubmit}>
                            <label>Name:</label>
                                <input type="text"                
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                required
                                
                                />
                            
                            <label>Shift:</label>
                                <div className="contractLabel">
                                <input ref={shiftInput} 
                                type="text"                
                                //value=''
                                //onChange={(e)=>setShift(e.target.value)}
                                //required
                                ></input>
                                <span><i onClick={handleAddShift} className="fa-solid fa-circle-plus"></i></span>
                                </div>  
                                {shifts.map((shift, index)=>{
                                    return <div className="item" key={index}>{shift}<span><i onClick={()=>handleRemove(setShifts, shifts, shift)} className="fa-solid fa-circle-minus"></i></span></div>
                                })}
                            
                            
                            <label>Skills:</label>
                                <div className="contractLabel">
                                <input ref={skillInput} 
                                type="text"                
                                //value=''
                                //onChange={(e)=>setShift(e.target.value)}
                                //required
                                />
                                <span><i onClick={handleAddSkill} className="fa-solid fa-circle-plus"></i></span>
                                </div>
                                {skills.map((skill, index)=>{
                                    return <div className="item" key={index}>{skill}<span><i onClick={()=>handleRemove(setSkills, skills, skill)} className="fa-solid fa-circle-minus"></i></span></div>
                                })}
                            
                {/*!isPending&&*/<button>{edit?'Update':'Add Record'}</button>}
                </form>
            </div>
            <div className="contracts">
                {data&&data.map(contract=>{
                    return <div key={contract._id} onClick={(e)=>handleEdit(e,contract)} className="contract">{contract.name}</div>
                })
                    
                }
            </div>
        </div>
     );
}
 
export default CreateEmployer;