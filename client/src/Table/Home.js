import {useContext, useRef, useState} from 'react';
import { Context } from "../context/Context";
import { formatDate } from "../Utils.js/Utils";
import useFetch from "../hooks/useFetch";


// Login Page      


const Home = () => {  
    const [date, setDate] = useState(formatDate(new Date().setHours(0,0,0,0)))
    const {data} = useFetch ("/events/countHols/ASOS/"+new Date(date).setHours(0,0,0,0))
    //console.log(data)
    return(
        <div className='holidayRaport'>
            <div>
                <input type="date" 
                value={date}
                onChange={(e)=>setDate(e.target.value)}
                required
                />
            </div>
            <div>
                {data&&<div className='totalDiv'>
                        <p>Total employees: {data.totalEmps}</p>
                        <p>Total Hours: {data.totalHours}</p>
                    </div>}
                {data&&data.contract.map((d, i)=>
                    {return <div className='shiftDiv' key={i}>
                                <p>Shift: {d.shift}</p>
                                <div>{d.events.map((event, j)=>{
                                    return  <div key={j} className={`eventDiv ${event.event}`}>
                                                <p>Operatives: {event.countShift}</p>
                                                <p>Hours: {event.hoursShift}</p>
                                            </div>
                                })
                                }</div>
                            </div>
                    })
                }
            </div>
        </div>
    )
}
 
export default Home;