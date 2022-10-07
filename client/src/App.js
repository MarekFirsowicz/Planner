import './App.css';
import './Table/Table.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './Table/Home';
import Navbar from './Table/Navbar';
import EmployeeData from './Employee/EmployeeData';
import NotFound from './NotFound'
import Raports from './Raports/Raports';
import Admin from './Admin/Admin';
import HR from './Table/HR';
import Register from './register/Register';
import { useContext } from 'react';
import { Context } from './context/Context';
import Login from './Login/Login';

//let user=true

function App() {
  const {user}=useContext(Context)
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/"  element={user?<Home/>:<Navigate to='/login' />} />
        <Route exact path="/login"  element={!user?<Login />:<Navigate to='/' />} />
        <Route exact path="/hr"  element={user&&user.accessLvl>2?<HR />:<Navigate to='/login' />} />        
        <Route exact path="/register"  element={<Register />} />
        <Route exact path="/admin"  element={user?<Admin/>:<Navigate to='/login' />} />
        <Route exact path="/raports"  element={user?<Raports />:<Navigate to='/login' />} />
        <Route exact path="/employees/:id" element={user?<EmployeeData />:<Navigate to='/login' />}/>
        <Route path="*"  element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
