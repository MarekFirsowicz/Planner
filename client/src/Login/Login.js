import axios from "axios";
import {useContext, useRef} from 'react';
import { Context } from "../context/Context";


const Login = () => {
    const userRef =  useRef()
    const passwordRef =  useRef()
    const {dispatch, isFetching} = useContext(Context)



    const handleLogin= async (e) =>{
        e.preventDefault()
        dispatch({type:'LOGIN_START'}) 
        const login = {username: userRef.current.value, password: passwordRef.current.value}
        try {
            const res = await axios.post('/auth/login/', login)
            dispatch({type:'LOGIN_SUCCESS', payload:res.data})
        } catch (err) {  
            dispatch({type:'LOGIN_FAILURE'})     
        }
    }
    
    return (             
        <div className="create">
        {/*<Link to="/register"><span>Register</span></Link>*/}
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <label>Login:</label>
            <input type="text"                
            ref={userRef}
            required
            />
            <label>Password:</label>
            <input type="password"                
            ref={passwordRef}
            required
            />
            

            {/*!isPending&&*/<button disabled={isFetching}>Login</button>}
            {/*isPending &&<button>Adding record...</button>*/}
        </form>
        {/*<button onClick={handleDisable}>edit</button>*/}
    </div>
     );
    
}
 
export default Login;