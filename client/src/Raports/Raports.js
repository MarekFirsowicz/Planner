import { useState } from "react";
import { formatDate } from "../Utils.js/Utils";

import './raport.css'

import useFetch from "../hooks/useFetch";
import HolidayRaport from "./HolidayRaport";
import OperativesOnShift from "./OpertivesOnShift";

const Raports = () => {
    const [shiftName, setShift] = useState('')
    const [contract, setContract] = useState('')
    const [date, setDate] = useState(formatDate(new Date().setHours(0,0,0,0)))
    const {data:contracts} = useFetch("/contracts")
    const {data:employees} = useFetch("/employees/tester/tester/?contract="+contract+"&shiftName="+shiftName+"")
    
    //console.log(new Date(date).setHours(0,0,0,0))
    const optionNames = (data, prop)=>{
        let arr=[]
        contracts.forEach((el)=>{
            if(el.name===data){
                arr=el[prop]
            }
        })
        return arr
    }    

    return ( 
        <div>
            <div className="raport">
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
            </div>
            
            {shiftName&&<div className="holidayRaport">
                <HolidayRaport shift={shiftName} date={date} setDate={setDate}/>
            </div>}
            {shiftName&&<div className="holidayRaport">
                {employees.employees.map(employee=>{
                    return <OperativesOnShift key={employee._id} employee={employee} date={date}/>
                })}
                
            </div>}
        </div>
     );
}
 
export default Raports;