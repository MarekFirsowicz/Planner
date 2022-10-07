//format date to locale string
export  const displayDate = (dates)=>{
    const date = new Date(dates).toLocaleString().slice(0,10)
    return date
}


//return difference between two dates
export  const dateDiff = (dates)=>{
const date = new Date(dates)
var today = new Date();
var year = today.getUTCFullYear();
var month = today.getUTCMonth() + 1;
var day = today.getUTCDate();
var yy = date.getUTCFullYear()
var mm = date.getUTCMonth() + 1;
var dd = date.getUTCDate();
var years, months, days;
// months
months = month - mm;
if (day < dd) {
    months = months - 1;
}
// years
years = year - yy;
if (month * 100 + day < mm * 100 + dd) {
    years = years - 1;
    months = months + 12;
}
// days
days = Math.floor((today.getTime() - (new Date(yy + years, mm + months - 1, dd)).getTime()) / (24 * 60 * 60 * 1000));
//
return `Y:${years}/M:${months}/D:${days}`
}


// change fist har. to capital letter
export const capitals =(data)=>{
    const str = data.charAt(0).toUpperCase()
    const srtCont = data.slice(1)
    return str+srtCont
}


//format date to yyyy/mm/dd
export const formatDate =(data)=>{
    const date = new Date(data)
    const year = date.getFullYear()
    const month = (date.getMonth()+1)<10?'0'+ (date.getMonth()+1): (date.getMonth()+1)
    const day = date.getDate()<10?'0'+ date.getDate(): date.getDate()
    const updatedData = (`${year}-${month}-${day}`)
    return updatedData
}

//sum hours of booked holidays for operative
export const countbookedHours = (data)=>{
    const events = data.filter(event=>{return event.eventName==='holiday'})    
    const dates = events.map(event=>{    
        return event.dates.reduce((total, date)=>{
            return date.hours+total
        },0)
    })
    const sum = dates.reduce((total,date)=>{return date+total},0)
    return sum    
}

//check number of absences for operative
export const countAbsences = (data)=>{
    let count = 0
    data.forEach(el=>{
        if(el.eventName==='absence'){
            count++
        }
    })
    return count
}

//calculate events to be confirmed by HR
export const countEvents =(events)=>{
    //const events = record.events
    let hol = null
    let absence = null
    let aaup = null
    let cancel = null        

    events.forEach(el => {
        const names = ['holiday', 'aaup', 'absence']
        if(el.eventName === 'holiday'&&el.confirmed===false){
            hol++
        };
        if(el.eventName === 'absence'&&el.confirmed===false){
            absence++
        };
        if(el.eventName === 'aaup'&&el.confirmed===false){
            aaup++
        };
        el.dates.forEach(date=>{
            if(date.update===true&&names.some(name=>name===el.eventName)){
                cancel++
            }
        })

    });
    return {hol, absence, aaup, cancel}
}