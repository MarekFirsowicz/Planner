import { useState } from "react";
import CreateEmp from './CreateEmp';
import CreatePattern from "./CreatePattern";
import CreateEmployer from "./CreateEmployer";
import './admin.css'
import CreateCalendar from "./CreateCalendar";
import CreateUser from "./CreateUser";

//<i class="fa-solid fa-industry"></i> <i class="fa-brands fa-mendeley"></i> <i class="fa-solid fa-database"></i>
const Admin = () => {
    const [panel, setPanel] = useState(<CreateEmp />)

    return ( 
        <div className="panels">
            <div className="admnBtns">
                <div onClick={()=>setPanel(<CreateEmp />)}><i className="fa-solid fa-person"></i>
                <p>empl</p>
                </div>
                <div onClick={()=>setPanel(<CreatePattern />)}><i className="fa-brands fa-mendeley"></i>
                <p>pattern</p>        
                </div>
                <div onClick={()=>setPanel(<CreateEmployer />)}><i className="fa-solid fa-industry"></i>
                <p>contr</p>        
                </div>
                <div onClick={()=>setPanel(<CreateCalendar />)}><i className="fa-solid fa-calendar"></i>
                <p>dates</p>        
                </div>
                <div onClick={()=>setPanel(<CreateUser />)}><i className="fa-solid fa-person"></i>
                <p>user</p>
                </div>
            </div>
            {panel}
        </div>
     );
}
 
export default Admin;