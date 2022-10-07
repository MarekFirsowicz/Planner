import { useState } from "react";
import axios from "axios";


const CreateCalendar = () => {
    const [startCalendar, setStartCalendar] = useState('')
    const [startClipperWeeks, setStartClipperWeeks] = useState('')
    const [weekNo, setWeekNo] = useState(52)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const newCalendar = {startCalendar, startClipperWeeks, weekNo}
       
        try {
            await axios.post("/calendars/",newCalendar)
        } catch (err) {
            console.log(err)
        }

        setStartCalendar('')
        setStartClipperWeeks('')
        setWeekNo('')
        console.log(newCalendar)
    }

    const calculateEndDate =(date)=>{
        const startDate = new Date(date)
        const year = startDate.getFullYear()
        console.log(year)
    }

    startCalendar&&calculateEndDate(startCalendar)

    return ( 
        <div className="panel">
            <div>
                <div className="create">
                    <h2>Calendar Setters</h2>

                    <form onSubmit={handleSubmit}>                        

                        <label>Start Calendar:</label>                            
                            <input type="month"
                            value={startCalendar}
                            onChange={(e)=>setStartCalendar(e.target.value)}
                            required
                            />
                        <label>End Calendar</label>
                        <input type="month"
                            value={startCalendar}
                            disabled
                            required
                            />

                        <label>Start Clipper Weeks:</label>                            
                            <input type="date" 
                            value={startClipperWeeks}
                            onChange={(e)=>setStartClipperWeeks(e.target.value)}
                            required
                            /> 
                        

                        <label>Number of Clipper Weeks:</label>
                        <input type="number" 
                        value={weekNo}
                        onChange={(e)=>setWeekNo(parseInt(e.target.value))}
                        />
                        <button>Add Record</button>

                    </form>
                    
                </div>
            </div> 
            
        </div>      
     );
}
 
export default CreateCalendar;