import useFetch from "../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import './employee.css'
import DisplayEmpData from "./DislayEmpData";
import Calendar from "../Calendar/Calendar";
import axios from "axios";

const EmployeeData = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const {data:personalData, loading, error, refetchData} = useFetch("/employees/"+id)
    const {data:patterns} = useFetch("/patterns/name")
    
    const handleDeleteEmp = async () =>{
        try {
            await axios.delete("/employees/"+id)
        } catch (err) {
            console.log(err)
        }
        navigate('/')
    }
    
    return ( 
        <div className="wrapper">
            {error && <div>{error}</div>}
            {loading && <div>Loading...</div>}
            {personalData&&patterns?
            <div className="recordDetails">
            <DisplayEmpData personalData={personalData} handleDeleteEmp={handleDeleteEmp} refetchData={refetchData} patterns={patterns}/>
            <Calendar personalData={personalData} refetchData={refetchData}/>
            </div>
            :null}
        </div>
     );
}
 
export default EmployeeData;