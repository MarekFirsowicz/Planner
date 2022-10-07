import axios from "axios";
import { useState } from "react";
import useFetch from "../hooks/useFetch";

const CreateUser = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [contract, setContract] = useState('')
    const [shifts, setShifts] = useState([])
    const [accessLvl, setAccessLvl] = useState(1)
    //const [role, setRole] = useState('')

    const [error, setError] = useState(false)

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

    const handleCheckbox =(e)=>{        
        let updatedList = [...shifts];
        if (e.target.checked) {
        updatedList = [...shifts, e.target.value];
        } else {
        updatedList.splice(shifts.indexOf(e.target.value), 1);
        }
        setShifts(updatedList);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError(false)
        const register = {username, password, contract, shifts, accessLvl}
        console.log(register)
        try {
            //Const res = await axios.post("/auth/register", register)
            await axios.post("/auth/register", register)
            console.log(register)
        } catch (err) {
            setError(true)
        }        
        setUsername('')
        setPassword('')
        setContract('')
        setAccessLvl(1)
        setShifts([])
        document.querySelectorAll('input[type=checkbox]').forEach(el=>el.checked=false)

    }

    return ( 
        <div className="create">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input type="text"                
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
                />
                <label>Password:</label>
                <input type="password"                
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />

                <label>Access Level</label>
                <input type="number" 
                step="1"
                min='1'
                max='4'
                value={accessLvl}
                onChange={(e)=>setAccessLvl(parseInt(e.target.value))}
                required
                />

                <label>Contract:</label>
                <select            
                value={contract}                
                onChange={(e)=>setContract(e.target.value)}
                >
                <option disabled value="">Pick Contract</option>
                {contracts&&contracts.map((el)=>{
                        return <option key={el._id} value={el.name}>{el.name}</option>
                    })}
                </select>
                               
                {contract&&<div className="checkboxes">
                    {contract&&optionNames(contract, 'shifts').map((el, index)=>{
                        return <label key={index}>{el}<input onChange={handleCheckbox} value={el} type="checkbox" /></label>
                    })} 
                </div>}
                

                {error&&<p className="error">Something went wrong !!!</p>}
                {/*!isPending&&*/<button>Register</button>}
                {/*isPending &&<button>Adding record...</button>*/}
            </form>
            {/*<button onClick={handleDisable}>edit</button>*/}
        </div>
     );
}
 
export default CreateUser;