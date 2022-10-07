import useFetch from "../hooks/useFetch";

const HolidayRaport = ({shift, date, setDate}) => {

    const {data:holCount} = useFetch ("/events/countHols/holiday/"+shift+"/"+new Date(date).setHours(0,0,0,0))   
    
    return ( 
        <>
        <div>
            <input type="date" 
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            required
            />
        </div>
        <div>
            <p>Operaives having holidays: <span>{holCount&&holCount.count}</span></p>
            <p>Total hours of holidays: <span>{holCount&&holCount.total}</span></p>
            
        </div>
        </>
     );
}
 
export default HolidayRaport;