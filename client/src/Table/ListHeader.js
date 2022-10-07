const ListHeader = ({setFilters, filter, sorter, setSorter}) => {

    const sorters = document.querySelectorAll('th[data-name]')
    sorters.forEach(el=>{
        if(el.dataset.name===sorter){
            el.classList.add('activeSorter')
        }else{
            el.classList.remove('activeSorter')
        }
    })
    //console.log(sorters)

    return ( 
        <thead className="recordHeader">
            <tr>                
            <th>Name</th>
            <th className={`filter`} onClick={(e)=>setSorter('All')}>Surname</th>
            <th>Emp No</th>
            <th data-name='contract' className={`filter`} onClick={(e)=>setSorter(e.target.dataset.name)}>Contract</th>
            <th>EMPL</th>
            <th data-name='startDate' className={`filter`} onClick={(e)=>setSorter(e.target.dataset.name)}>Start Date</th>
            <th>Service</th>
            <th data-name='shiftName' className={`filter`} onClick={(e)=>setSorter(e.target.dataset.name)}>Shift</th>
            <th>Pattern</th>
            <th>ALW</th>
            <th>Booked</th>
            <th data-name='holidaysLeft' className={`filter`} onClick={(e)=>setSorter(e.target.dataset.name)}>Left</th>
            <th>Hrs</th>           
            <th className={`filter ${filter&&'activeFilter'}`} onClick={filter?()=>setFilters(''):()=>setFilters('update=1')}>Edit</th>
            </tr>
        </thead>
     );
}
 
export default ListHeader;