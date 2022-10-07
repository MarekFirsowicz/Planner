import { useState } from "react";
import ListHeader from "./ListHeader";
import ListRow from "./ListRow";


const DataList = ({data, setFilters, filter, sorter, setSorter}) => {

    return (         
        <table className="recordTable" >
            <ListHeader sorter={sorter} setSorter={setSorter} filter={filter} setFilters={setFilters}/>
            <tbody>            
            {data.employees.map((record)=>
            (                   
                 <ListRow   record={record} key={record._id}/>   
                             
            ))}
            </tbody>
        </table>       
     );
}
 
export default DataList;