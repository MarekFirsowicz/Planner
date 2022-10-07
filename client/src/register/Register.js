import axios from "axios";
import {useState } from 'react';




const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)



    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError(false)
        const register = {username, email, password}
        try {
            const res = await axios.post("/auth/register", register)
            res.data&&window.location.replace('/')
        } catch (err) {
            setError(true)
        }        
        setUsername('')
        setEmail('')
        setPassword('')
    }    

    return ( 
        <div className="create">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input type="text"                
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
                />
                <label>Email:</label>
                <input type="text"                
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />
                <label>Password:</label>
                <input type="password"                
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />

                {error&&<p className="error">Something went wrong !!!</p>}
                {/*!isPending&&*/<button>Register</button>}
                {/*isPending &&<button>Adding record...</button>*/}
            </form>
            {/*<button onClick={handleDisable}>edit</button>*/}
        </div>
    );
}
 
export default Register;