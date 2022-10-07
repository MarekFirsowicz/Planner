
const CalendarMonthHeader = ({monthIndex, year}) => {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

    return ( 
        <div className="monthHeader">
            <h3>{months[monthIndex]} <span>{year}</span></h3>
            <div className="days">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
            </div>

        </div>
     );
}
 
export default CalendarMonthHeader;