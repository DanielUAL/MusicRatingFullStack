import React, { useState, useEffect } from "react"; 
import { Link, useNavigate  } from "react-router-dom"
import baseURL from "../api/apiKirby";

export let usedEmail = 'default';
export let usedName = 'default';
export const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate ();
    
    useEffect(() => {
        const storedEmail = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword)
          setIsChecked(true);
        }
      }, []);
      
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
      
    const handleSubmit = (e) => {
        e.preventDefault();

        const rememberMe = isChecked;

        if (rememberMe) {
            localStorage.setItem('username', email); 
            localStorage.setItem('password', password);
          } else {
            localStorage.removeItem('username'); 
            localStorage.removeItem('password'); 
        }
        
        fetch(`${ baseURL }/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email , password: password})
        })
        .then(response => {
            console.log(response); // Check the response structure
            return response.json();
          })
        .then(data => {
            console.log(data); // Handle the response from the server
            if (data.message === "Login successful") {
                console.log('Login Success');
                setIsLoggedIn(true);
                const {name} = data; //Imported from the query done in login that only gets username
                usedName = name; 
                usedEmail = email;
                navigate('/home'); // Redirect to the home page
            }else{
                console.log('Error');
                window.alert(data.message);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
    };

    return(
    <div className="bg-cover bg-[url('/src/valley_50.png')] h-screen flex items-center justify-center auth-form-container">
        <form onSubmit={handleSubmit} action="#">
            <div className = "flex items-center justify-center">
                <div className="rounded-full bg-dark-tan-color px-20 py-20 shadow-xl borderCircle">
                    <div>
                        <img  class="mb-2 mx-auto h-60 w-auto rounded-full"
                        src={'https://cdn.pixabay.com/photo/2021/02/07/19/39/kirby-5992484_1280.png'}/>
                    <h1 className='font-Inter text-2xl bg-clip-text text-transparent bg-tan-color flex justify-center py-3'>{'Welcome to Kirbys Judgment'}</h1>
                    </div>

                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        <label htmlFor="email" class="block text-sm font-medium leading-6 text-gray-950"></label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter" minLength = "6" maxLength = "30" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                    </div>
        
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm py-2">
                        <label htmlFor="password"></label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter" minLength = "8" maxLength = "30" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                    </div>
                    
                    <div class="font-Inter bg-clip-text text-transparent bg-tan-color">
                        <label>
                            <input id="localstoredRemember" type = "checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                            Remember me
                        </label>
                    </div>   
                    
                    <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                        <button class="ml-10 font-Inter bg-clip-text text-transparent bg-tan-color" type="submit" >Log in</button>
                    </div>        

                    <div class="sm:mx-auto sm:w-full sm:max-w-sm py-1">
                        <nav>
                            <ul>
                                <li class="ml-10 font-Inter bg-clip-text text-transparent bg-tan-color"><Link to="/register">Don't have an account? Register here!</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>     
            </div>
        </form> 
    </div>
    )
}