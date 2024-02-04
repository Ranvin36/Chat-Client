import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
import Favourites from './components/favourites';
import Blocked from './components/block';
import Settings from './components/settings';
import ChangeUsername from './components/changeUsername';
import ResetPassword from './components/resetPassword';
import UpdateProfile from './components/updateProfile';
import { useState } from 'react';
import { UseSelector, useSelector } from 'react-redux';

function App() {
  const [userData, setUserData] = useState([]);
  const Token = useSelector((state)=> state.auth.token)

  const isLoggedIn = () => {
    return Token && Token.length > 0;
  };

  console.log(Token)

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={!isLoggedIn()?<Signup /> : <Navigate to='/home'/>} />
        <Route path='/login' element={!isLoggedIn()?<Login /> : <Navigate to='/home'/>} />

        {/* Protected routes */}
        <Route path='/home' element={isLoggedIn() ? <Home setUserData={setUserData} userData={userData} /> : <Navigate to="/login" />} />
        <Route path='/favourites' element={isLoggedIn() ? <Favourites /> : <Navigate to="/login" />} />
        <Route path='/blocked' element={isLoggedIn() ? <Blocked /> : <Navigate to="/login" />} />
        <Route path='/settings' element={isLoggedIn() ? <Settings /> : <Navigate to="/login" />} />
        <Route path='/change-username' element={isLoggedIn() ? <ChangeUsername /> : <Navigate to="/login" />} />
        <Route path='/profile-picture' element={isLoggedIn() ? <UpdateProfile /> : <Navigate to="/login" />} />
        <Route path='/reset-password' element={isLoggedIn() ? <ResetPassword /> : <Navigate to="/login" />} />
        <Route path='/reset-password/:resetToken' element={isLoggedIn() ? <ResetPassword type="pass" /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
