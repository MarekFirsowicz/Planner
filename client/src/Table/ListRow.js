import { Link } from "react-router-dom";
import {formatDate, dateDiff, capitals} from "../Utils.js/Utils";


//show all FTE records
const ListRow = ({record}) => { 
    return ( 
        <tr style={{color:"black"}} className='record' >                    
                    <td>{capitals(record.name)}</td>
                    <td>{capitals(record.surname)}</td>
                    <td>{record.employeeNo}</td>
                    <td>{record.contract}</td>
                    <td>{record.employeer}</td>
                    <td>{formatDate(record.startDate)}</td> 
                    <td>{dateDiff(record.startDate)}</td>
                    <td>{record.shiftName}</td> 
                    <td>{record.pattern}</td>
                    <td>{record.entitlement}</td>
                    <td>{record.holidaysBooked}</td>                    
                    <td style = {record.holidaysLeft<=record.rotationHours?{color:'red'}:null}>{record.holidaysLeft}</td>
                    <td>{record.shiftHours}</td>
                    <td>
                    <Link to={`/employees/${record._id}`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    {record.confirmHoliday>0&&<div className="holidayCount">{record.confirmHoliday}</div>}
                    {record.confirmAaup>0&&<div className="aaCount">{record.confirmAaup}</div>} 
                    {record.confirmAbsence>0&&<div className="absenceCount">{record.confirmAbsence}</div>}
                    {record.confirmCancel>0&&<div className="cancelCount">{record.confirmCancel}</div>}                                      
                    </td>
                </tr> 
     );
}
 
export default ListRow;