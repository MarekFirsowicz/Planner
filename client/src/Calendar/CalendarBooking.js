import { useState, useEffect } from "react";
import axios from "axios";


const CalendarBooking = ({personalData, holDays, setHolDays, setClickedDays, refetchData, refetchBookedData}) => {
    const [eventName, setEventName] = useState('')
    const [textArea, setTextArea] = useState('')    
    const [halfDay, setHalfday] = useState(false)
    const holHours = holDays.reduce((total,hols)=>{return hols.hours+total},0)// check******************
    const hoursLeft = eventName==='holiday'&&personalData.entitlement-personalData.holidaysBooked-holHours   
   
    useEffect(()=>{
       holDays.length===1&&holDays[0].hours<personalData.shiftHours?setHalfday(true):setHalfday(false)
    },[holDays, personalData.shiftHours])
  
    const handelHalfDay = ()=>{        
        if(holDays.length===1){             
            setHolDays(holDays.map((day, index)=>index===0?{...day,hours:personalData.shiftHours/2, halfDay:'am'}:day))
        }
        if(holDays.length>1){
            setHolDays(holDays.map((day, index)=>index===0?{...day,hours:personalData.shiftHours/2, halfDay:'pm'}:day))
        }
    }

    const handleBooking = async (e) =>{
        e.preventDefault()
        const id = personalData._id
        const dates = holDays
        const newEvent = {eventName, desc:textArea?textArea:[], dates, confirmed:eventName==='decline'||personalData.employeer!=='FTE'?true:false}
        try {
            await axios.post("/events/"+id,newEvent)
        } catch (err) {
            console.log(err)
        }
        setClickedDays({firstDay:'', lastDay:''})
        setHolDays([])
        refetchData()
        refetchBookedData()
    }

    
    const options={        
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        weekday: "short",
    }    

    return ( 
        <div className="booking">
            <form className="form" onSubmit={handleBooking}>
                <select            
                value={eventName}                
                onChange={(e)=>setEventName(e.target.value)}
                required
                >
                <option disabled value=''>Choose Event</option>
                <option value="holiday">holiday</option>
                <option value="absence">absence</option>
                <option value="decline">decline</option>
                <option value="aaup">AAUP</option>                
                </select>
                <div>From: <span>{new Date(holDays[0].date).toLocaleString('en-GB', options)}</span></div>
                    <label>Full day:
                        <input checked={holDays[0].hours===personalData.shiftHours}   onChange={(e)=>setHolDays(holDays.map((day, index)=>index===0?{...day,hours:personalData.shiftHours, halfDay:'fd'}:day))} type="radio" name='firstDay' />
                    </label>
                    
                    <label>Half day
                        <input  checked={holDays[0].hours===personalData.shiftHours/2}  onChange={(e)=>handelHalfDay()} type="radio" name='firstDay' />
                    </label>  

                    <label>Custom Hours:
                        <input                            
                            required
                            step=".25"
                            min='0.25'
                            max='11.5'
                            type='number' value={holDays[0].hours} onChange={(e)=>setHolDays(holDays.map((day, index)=>index===0?{...day,hours:parseFloat(e.target.value)}:day))} >
                        </input>                        
                    </label>
                     
                    {halfDay&&(
                            <div>
                            <label>a.m.:
                                <input checked={holDays[0].halfDay==='am'}  type="radio" name='halfDay' onChange={(e)=>setHolDays(holDays.map((day, index)=>index===0?{...day,halfDay:'am'}:day))}/>
                            </label>
                            
                            <label>p.m.:
                                <input checked={holDays[0].halfDay==='pm'} type="radio" name='halfDay' onChange={(e)=>setHolDays(holDays.map((day, index)=>index===0?{...day,halfDay:'pm'}:day))}/>
                            </label>
                            </div>)
                    }
                
                    {holDays.length>1&&(<>
                    <div>Till: <span>{new Date(holDays[holDays.length-1].date).toLocaleString('en-GB', options)}</span></div>
                    <label>Full day:
                        <input checked={holDays[holDays.length-1].hours===personalData.shiftHours}   onChange={(e)=>setHolDays(holDays.map((day, index)=>index===holDays.length-1?{...day,hours:personalData.shiftHours, halfDay:'fd'}:day))} type="radio" name='lastDay' />
                    </label>
                    
                    <label>Half day
                        <input  checked={holDays[holDays.length-1].hours===personalData.shiftHours/2}  onChange={(e)=>setHolDays(holDays.map((day, index)=>index===holDays.length-1?{...day,hours:personalData.shiftHours/2, halfDay:'am'}:day))} type="radio" name='lastDay' />
                    </label>  

                    <label>Custom Hours:
                        <input                            
                            required
                            step=".25"
                            min='0.25'
                            max='11.5'
                            type='number' value={holDays[holDays.length-1].hours} onChange={(e)=>setHolDays(holDays.map((day, index)=>index===holDays.length-1?{...day,hours:parseFloat(e.target.value)}:day))} >
                        </input>                        
                    </label>

                    
                    </>)}
                    <div>Hours booked: {holHours}</div>
                    <div>Days booked: {holDays.length}</div>
                    <div>Hours Left: {hoursLeft}</div>

                    <textarea value={textArea} onChange={(e)=>setTextArea(e.target.value)} className="comments" rows={10} spellCheck={true} placeholder="Add comment" ></textarea>
                    <div>{hoursLeft>=0&&<button ><i  className="fa-solid fa-calendar-plus "></i></button>}    <i onClick={()=>{setClickedDays({firstDay:'', lastDay:''})}} className="fa-solid fa-xmark"></i></div>
            </form>
            

        </div>
     );
}
 
export default CalendarBooking;