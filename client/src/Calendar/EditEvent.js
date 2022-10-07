import axios from "axios";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { capitals, formatDate} from "../Utils.js/Utils";

const EditEvent = ({eventId, refetchData, handleCloseEditModal, refetchBookedData, matrix, shiftHours, eventsData}) => {
    const [textArea, setTextArea] = useState('')

    const {data:eventData, loading, error, refetchData:refetchEdit} = useFetch('/events/event/'+eventId)// get event that is being edited


    // delete event from employee
    const handleCancelEvent = async()=>{        
        try {
            await axios.put('/events/deleteEvent/'+eventData._id)
        } catch (err) {        
        }
        refetchData()    
        refetchBookedData()
        handleCloseEditModal()
    }

    // update event / if it is declined holiday delete it
    const handleUpdateEvent = async(id, halfday, hoursUpdate)=>{ 
        if(eventData.eventName==='decline'&&eventData.dates.length>1){
            try {
                await axios.put('/events/dateDelete/'+eventData._id+'/'+id)
            } catch (err) {        
            }
            refetchEdit()
        }else if(eventData.eventName==='decline'&&eventData.dates.length===1){
            handleCancelEvent()
        }        
        else{   
        try {
            await axios.put('/events/dateUpdate/'+eventData._id+'/'+id, {update: true, halfDay: halfday, hours: hoursUpdate})            
        } catch (err) {        
        }
        refetchEdit()
        }        
        refetchBookedData()
        refetchData()
    }   
    

    //update comment
    const handleAddComment =async()=>{
        //console.log(textArea)
        try {
            await axios.put('/events/descUpdate/'+eventData._id,{desc:textArea})
        } catch (err) {        
        }
        setTextArea('')
        refetchEdit()
    }


    // add absence to existing one instead of creating new one
    const handleAddAbsence=async()=>{
        const addDay = matrix.findIndex(el=>el.date===eventData.dates[eventData.dates.length-1].date)
        const date = matrix[addDay+1].date
        try {
            await axios.put('/events/addAbsence/'+eventData._id,{"date":date, "halfDay":"fd", "hours":shiftHours})            
        } catch (err) {        
        }
        refetchEdit()
        refetchBookedData()
        refetchData()
    }


    //check if next day is absence
    const checkNextDay = ()=>{
        if(eventData.eventName!=='absence') return 
        const addDay = matrix.findIndex(el=>el.date===eventData.dates[eventData.dates.length-1].date)
        const nextDay = matrix[addDay+1].date
        let checked = false
        eventsData.forEach(el => {
            el.dates.forEach(el=>{
                if(el.date===nextDay){
                    checked = true
                }
            })
        });
        return checked
    }

    return eventData&&(
        <div> 
            <h2 className="updateEvent">{capitals(eventData.eventName)}<span>{!checkNextDay()&&eventData.eventName==='absence'&&<i onClick={handleAddAbsence} className="fa-solid fa-circle-plus"></i>}<i onClick={handleCancelEvent} className="fa-solid fa-trash"></i></span></h2>

            <div className="dates">{eventData.dates.map((date)=>{                
                return  date.hours!==0&&
                    <div className="updateEvent dateDiv" key={date._id}>
                            <div className={`dateUpdate ${eventData.eventName} ${date.halfDay}`}>
                                {date.halfDay==='fd'&&(eventData.eventName!=='absence'&&eventData.eventName!=='decline')&&<div>pm: <button onClick={()=>handleUpdateEvent(date._id, 'am', date.hours/2)}><i className="fa-solid fa-circle-minus"></i></button></div>}

                                <div>{formatDate(date.date)} <button onClick={()=>handleUpdateEvent(date._id, 'fd', 0)}><i className="fa-solid fa-circle-minus"></i></button></div>
                                {date.halfDay==='fd'&&(eventData.eventName!=='absence'&&eventData.eventName!=='decline')&&<div>am: <button onClick={()=>handleUpdateEvent(date._id, 'pm', date.hours/2)}><i className="fa-solid fa-circle-minus"></i></button></div>}
                            </div>
                            
                    </div>
            })}</div>
            
            {eventData.desc&&<div className="eventDesc">
                        {eventData.desc.map((comment, index)=>{
                            return <p key={index}>{comment}</p>
                        })}
            </div>}
            <div className="addComment">
                <textarea  value={textArea} onChange={(e)=>setTextArea(e.target.value)} className="comments" rows={10} spellCheck={true} placeholder="Add comment" ></textarea>
                {textArea&&<i onClick={()=>handleAddComment()} className="fa-solid fa-circle-plus"></i>}
            </div>

        </div>
        
     );
}
 
export default EditEvent;