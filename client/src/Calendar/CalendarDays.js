
const CalendarDays = ({day, handleClick, clickedDays, hanldeEdit}) => {
    // dynamic styels to be created in future - do not forgett      

    const displayDayIcon = ()=>{
        if(day.shift==='day'){
            return <i className="fa-solid fa-sun"></i>
        } else if (day.shift==='night'){
            return <i className="fa-solid fa-moon"></i>
        }
    }
    
    const event = ()=>{
        if(day.shift&&(day.dateTime<=clickedDays.lastDay&&day.dateTime>=clickedDays.firstDay)){    
            return 'event'
        }else{return null}
    }   

    const checkToday = ()=>{   
        if(new Date(day.dateTime).getTime()===new Date().setHours(0,0,0,0)){
           return 'today'
        }
    }

    checkToday()
    const handleOnClick =(e)=>{        
        !day.eventName?handleClick(e,day.dateTime):hanldeEdit(e,day.eventId)
    }

    return ( 
        
        <div onClick={day.shift||day.eventName?(e)=>handleOnClick(e):null}
        className={`day  
                    ${day.shift&&(day.eventName||'shiftActive')}
                    ${day.value&&'active'}
                    ${day.eventName&&day.eventName}
                    ${day.eventName&&day.booked}
                    ${day.eventName&&day.confirm}
                    ${day.updated&&'updated'}
                    ${day.desc&&'desc'}
                    ${event()}
                    `}
                    >
                    <div className="displayDayIcon"><span className={`dayValue ${checkToday()}`}>{day.value}</span><span className={`weekNo ${day.week%2?'even': 'odd'}`}>{day.week}{displayDayIcon()}</span></div>
                    <div className="displayDayIcon"><span className="shift" >{day.holsBooked?day.holsBooked:null}</span><span className="eventHours">{day.shiftHours}</span></div>
        </div>  
             
     );
}
 
export default CalendarDays;