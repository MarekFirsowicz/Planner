import { useContext } from 'react';
import {Link} from 'react-router-dom'
import { Context } from '../context/Context';

const Navbar = () => {
    const {user, dispatch}=useContext(Context)
    const handleLogout =()=>{
        dispatch({type:'LOGOUT'})
    }
    return ( 
        <nav className="navbar">            
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            {user&&user.accessLvl>3&&<Link to="/deleted">Deleted</Link>}
            {user&&user.accessLvl>1&&<Link to="/hr">HR</Link>}
            <Link to="/raports">Rapports</Link>
            {user&&<div className='user' onClick={handleLogout}>{user.username}: logaout</div>}
        </nav>
     );
}
 
export default Navbar;