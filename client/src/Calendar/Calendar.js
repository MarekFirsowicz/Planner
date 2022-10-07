import { useEffect, useState, useMemo, useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import './calendar.css'
import CalendarMonthHeader from './CalendarMonthHeader';
import CalendarDays from './CalendarDays';
import Modal from './Modal';
import CalendarBooking from './CalendarBooking';
import EditEvent from './EditEvent';

const Calendar = ({personalData, refetchData}) => {
    const [holYear, setHolYear] = useState(2022) // year holliday calendar begins
    const [firstHolMonth, setfirstHolMonth] = useState(4) //1st month of holliday year
    const [calendarData, setCalendarData] = useState()
    const [clickedDays, setClickedDays] = useState({firstDay: '', lastDay: ''})
    const [holDays, setHolDays] = useState([])
    const [editDay, setEditDay] = useState(null)


    const {data:patternData} = useFetch("/patterns/pattern/?name="+personalData.pattern)
    const {data:bookedData, refetchData:refetchBookedData} = useFetch("/events/find/holiday/"+personalData.shiftName)
    
   // console.log(bookedData)
    
    //Create shift pattern --------------------------------------------------------------------------
    const shiftMatrix = useCallback((pattern)=>{ // return array of shift pattern 
        const shiftPattern = pattern
        const shiftArray=[]
        const on = shiftPattern.daysOn
        const mixed = shiftPattern.mixed
        const off = shiftPattern.daysOff
        let active = shiftPattern.days   
        const start = new Date(shiftPattern.startDate)
        const end = new Date (holYear, firstHolMonth+12,0)
        const noDays = Math.floor((end-start)/(1000*60*60*24))
        let counter = 0
        let WeekelyCounter = 0
        if(shiftPattern.type==='shift'){ //regular shifts like 4 days on 2 days off and so son
        for(let i=1; i<=on; i++){
            const workDay = new Date(start)
            workDay.setDate(start.getDate()+counter)
            counter++
            if(workDay.valueOf()<=end.valueOf()){
                const date = new Date(workDay).valueOf()
                const shift = mixed?active?'day':'night':shiftPattern.days?'day':'night'                 
                shiftArray.push({date, shift})
            }
            if(i===on&&workDay.valueOf()<=end.valueOf()){
                counter=counter+off
                i=0
                active=!active
            }
        }}

        if(shiftPattern.type==='weekly'){ // shift with specific working days like mondays and tuesdays only
            for(let i=1;i<=noDays;i++){
                const workDay = new Date(start)
                workDay.setDate(start.getDate()+counter)                
                counter++                
                
                if(workDay.valueOf()<=end.valueOf()&&on.includes(workDay.getDay())){                    
                    const date = new Date(workDay).valueOf() 
                    if(Number.isInteger(WeekelyCounter/on.length)){
                        active=!active
                    }
                    WeekelyCounter++
                    const shift = mixed? active?'day':'night':shiftPattern.days?'day':'night'   
                    
                    shiftArray.push({date, shift})                      
                }                 
            }   
        }
        //console.log(shiftArray)
        return shiftArray    
    },[firstHolMonth, holYear] )

    //Gnerate Calendar -----------------------------------------------------------------------------------
    const calendarMatrix = useMemo( ()=>{    
        // retur array of calendar with month days and Clipper weeks
            const displayWeekNumb=(date)=>{        
            const countDay = 30
            const weekCountStart = new Date(holYear-1,7,countDay)               
            const checkDate = new Date(date)                   
            let inc= 0        
            for(let i=1;i<53;i++){
                for(let j=1; j<8; j++){                    
                    let weekDates = new Date(weekCountStart)
                    weekDates.setDate(weekCountStart.getDate()+(inc))          
                    if(checkDate.getTime()===weekDates.getTime()&&i<=52){
                        return i
                    }  
                        inc++                    
                }
                    if(i>=52){
                        i=0
                    } 
            }
        }
        //create months with props
        const yearlyDates =[] 
        for(let i=0;i<12;i++){
                const dates = new Date(holYear,firstHolMonth+i,1)
                const year = dates.getFullYear()
                const monthIndex = dates.getMonth()
                const firstDay = dates.getDay()
                const lastDayOfMonth = new Date(year,monthIndex+1,0).getDate()
                yearlyDates.push({year, monthIndex,days:[]})
    
            for(let j=1;j<firstDay+lastDayOfMonth+1;j++){ //create days that are not visible on calendar
                if(j<=firstDay){
                    yearlyDates[i].days.push({
                        value: null, 
                        dateTime: null
                    })                   
                }else if(j>firstDay){  //create days with props
                        const dateTime = new Date(year, monthIndex, j-firstDay).getTime()  
                        const shift= patternData&&shiftMatrix(patternData).find(arr=>arr.date===dateTime)
                        yearlyDates[i].days.push({
                        value: j-firstDay, // day number
                        week: displayWeekNumb(dateTime),// pass Clipper week                       
                        dateTime: dateTime, // numerical date
                        shift: shift?shift.shift:null,                
                    })
                }                
            }
        }
        return yearlyDates
    },[holYear,firstHolMonth,patternData, shiftMatrix]) 

//check Events
const bookedDays = useCallback ((date, events)=>{
    const dateTime = date
    
    const bookedEvents = events
    for(let i=0;i<bookedEvents.length;i++){
        for(let j=0;j<bookedEvents[i].dates.length;j++){
            if(dateTime===bookedEvents[i].dates[j].date){
                const booked = bookedEvents[i].dates[j].halfDay
                const confirm = bookedEvents[i].confirmed===false?'confirm':null
                const shiftHour = bookedEvents[i].dates[j].hours
                const eventname = bookedEvents[i].eventName
                const dateId = bookedEvents[i].dates[j]._id
                const eventId = bookedEvents[i]._id
                const updated = bookedEvents[i].dates[j].update
                const desc = bookedEvents[i].desc.length>0?true: false
                return {booked, confirm, shiftHour, eventname, dateId, eventId, updated, desc}
            }
        }          
    }
},[])


//update Calendar Matrix
const updateEvents = useMemo (()=>{
    const holsCounter = (date)=>{
        let count = 0
        bookedData.filter((el) => el._id===date?count=el.count:null)
        return count
    }

    const bookedEvents=personalData.events
    const dataMatrix = calendarMatrix&&calendarMatrix
    dataMatrix.map((month)=>(        
        month.days.map((day)=>{           
            const booked = bookedDays(day.dateTime, bookedEvents) 
            day.holsBooked = bookedData&&holsCounter(day.dateTime)
            day.booked = booked?booked.booked:null            
            day.shiftHours = booked?booked.shiftHour:null
            day.eventName = booked?booked.eventname:null
            day.dateId = booked?booked.dateId:null
            day.eventId = booked?booked.eventId:null
            day.confirm = booked?booked.confirm:null
            day.updated = booked?booked.updated:null
            day.desc = booked?booked.desc:null
            return day   
        })
    ))   
    return dataMatrix
    
},[calendarMatrix, bookedDays, personalData, bookedData])

//set Calendar state
    useEffect(()=>{
        setCalendarData(updateEvents)   
    },[updateEvents])

    
//check if ther are no already booked days between clicked dates
    const checkIfAv=(a, b, arr)=>{        
        arr.forEach(event=>{
            event.dates.forEach(data=>{
                if(data.date>a&&data.date<b){
                    setClickedDays({firstDay:'', lastDay:''})                    
                }
            })            
        })     
    }

    
    //fire above function when clicked dates change
    useEffect(()=>{
        checkIfAv(clickedDays.firstDay, clickedDays.lastDay, personalData.events)
    },[clickedDays,personalData.events])

    //handle dates selection 
    const handleClick =(e, data)=>{
        if(!clickedDays.firstDay){
            setClickedDays({firstDay:data, lastDay:data})            
        }
        if(clickedDays.firstDay&&data>clickedDays.lastDay){
            setClickedDays({...clickedDays,lastDay:data})            
        }
        if(clickedDays.firstDay&&data<clickedDays.firstDay){
            setClickedDays({...clickedDays,firstDay:data})            
        }
        if(clickedDays.firstDay&&clickedDays.lastDay===data){
            setClickedDays({firstDay:clickedDays.firstDay, lastDay:clickedDays.firstDay})            
        }
        if(clickedDays.lastDay&&clickedDays.firstDay===data){
            setClickedDays({firstDay:clickedDays.lastDay, lastDay:clickedDays.lastDay})            
        }
        if(clickedDays.firstDay===data&&clickedDays.lastDay===data){
            setClickedDays({firstDay:'', lastDay:''})  
            setHolDays([])          
        }
    }

    
    //set holidays days
    useEffect(()=>{        
        let clicked = []
        patternData&&shiftMatrix(patternData).filter((item)=>item.date>=clickedDays.firstDay&&item.date<=clickedDays.lastDay).map(finalData=>{
            return clicked.push({date:new Date(finalData.date).setHours(0,0,0,0), hours:personalData.shiftHours, halfDay:'fd'})//{date:finalData.date, hours:person.shiftHours}finalData.date
        })        
        clicked.sort()
        setHolDays(clicked)
    },[personalData.shiftHours, shiftMatrix, patternData, clickedDays])


    //edit mode
    const hanldeEdit=(e, day)=>{
        setEditDay(day)
    }

    //close edit modal
    const handleCloseEditModal =()=>{
        setEditDay(null)
        refetchData()
    }

   


    return ( 
        <>
        <div className='calendar'>
            {calendarData&&calendarData.map((month, index)=>(
                <div className='calendarMonth' key={index}>
                    <CalendarMonthHeader year={month.year} monthIndex={month.monthIndex} key={month.monthIndex}/>
                    <div className="monthDays">
                    {month.days.map((day, index)=>(                    
                        <CalendarDays handleClick={handleClick} clickedDays={clickedDays} hanldeEdit={hanldeEdit}  day={day} key={index} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        {holDays[0]&&<CalendarBooking refetchBookedData={refetchBookedData} personalData={personalData} setHolDays={setHolDays} refetchData={refetchData} holDays={holDays} setClickedDays={setClickedDays} />}

        {(editDay&&patternData)&&<Modal  handleClose={handleCloseEditModal}>
            <div className='modalForm'>
                    <EditEvent eventsData={personalData.events} shiftHours={personalData.shiftHours} matrix={shiftMatrix(patternData)} handleCloseEditModal={handleCloseEditModal} refetchBookedData={refetchBookedData} refetchData={refetchData} eventId={editDay} personId={personalData._id} />
            </div>
        </Modal>}
        </>
     );
}
 
export default Calendar;