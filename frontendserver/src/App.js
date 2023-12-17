import React, { useState } from "react"; 
import './App.css';
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { Routes, Route, Navigate } from 'react-router-dom';
 
function PrivateOutlet({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

  export function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={ <Login setIsLoggedIn={setIsLoggedIn}/>} /> 
          <Route path="/register" element={ <Register />} /> 
          <Route path="/login" element={ <Login setIsLoggedIn={setIsLoggedIn}/>} /> 
          <Route path="/home" 
          element={
            <PrivateOutlet isLoggedIn={isLoggedIn}>
              <Home />
            </PrivateOutlet>} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;