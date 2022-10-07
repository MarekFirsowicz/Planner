import { Link } from "react-router-dom";
import { capitals } from "../Utils.js/Utils";

const OperativesOnShift = ({employee, date}) => {
    
    const checkEvent=(events)=>{
        let style = null
        events.forEach(event => {           
            const item = event.dates.filter(d=>new Date(d.date).setHours(0,0,0,0)===new Date(date).setHours(0,0,0,0)&&d.update===false)
            if(item.length>0){
                return style=event.eventName
            }            
        });
        return style
    }    

    //const management = employee.filter(emp=>emp.skills.includes('TL'))
    //console.log(management)

    return (         
            <div className={`${checkEvent(employee.events)} shiftList`} key={employee._id}>
                <div className="employee">
                {capitals(employee.name)+' '+capitals(employee.surname)}
                <span>
                <Link to={`/employees/${employee._id}`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                </span>
                <span>{employee.employeer}</span>
                </div>
                <ul className="skillList">
                    {employee.skills.map(skill=>{
                        return <li key={skill}>{skill}</li>
                    })}
                </ul>
            </div>        
    );
}
 
export default OperativesOnShift;