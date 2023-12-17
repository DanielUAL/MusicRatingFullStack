import React, { useState } from "react"; 
import { Link } from "react-router-dom"
import { SHA256 } from 'crypto-js';
import ReCAPTCHA from "react-google-recaptcha";
import baseURL from "../api/apiKirby";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setName] = useState('');
    const [isVerified, setVerified] = useState(false);
    const [isComplete, setComplete] = useState(false);
    const onComplete = () => {
        setComplete({isComplete: true});
    }
    const onChange = () => {
        setVerified({isVerified: true});
     };
     
    <script src="https://www.google.com/recaptcha/api.js"></script>
    


    const handleSubmit = (e) => {
        e.preventDefault();
    
        const passwordRegex = /[#?!@$%^&*\[\]-]/;
        const passwordNumberRegex = /[0-9]/; 
        const passwordCapitalRegex = /[A-Z]/;
        const isPasswordValid = passwordRegex.test(password) && passwordNumberRegex.test(password) && passwordCapitalRegex.test(password);
        
        if (!isPasswordValid) {
          window.alert("Password must contain at least one special character, number, and capital letter");
          return;
        }

        const hashPassword = (password) => {
            return SHA256(password).toString();
        };
          
        const hashedPassword = hashPassword(password);

        fetch(`${ baseURL }/register`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username, email: email, password: hashedPassword })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data); // Handle the response from the server
            if (data.message === "Registration successful"){
                window.alert('Registration successful!');
            }else{
                console.log('Error');
                window.alert("Registration Failed");
            }
          })
          .catch(error => {
            window.alert("Registration Failed");
            console.log('Error:', error);
          });
      };

    return(
        <div className="bg-cover bg-[url('/src/kirbysbg.png')] h-screen flex items-center justify-center auth-form-container">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit} action="#">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className='font-Inter text-2xl bg-clip-text text-transparent bg-dark-tan-color flex justify-center py-3'>{'Create your Account'}</h1>
                </div>

                <div class="sm:mx-auto sm:w-full sm:max-w-sm py-1">
                    <label htmlFor="username" class="block text-gray-700 text-sm font-bold mb-2"></label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter" minLength = "2" maxLength = "30" value={username} onChange={(e) => setName(e.target.value)} type="username" placeholder="Username" id="username" name="username" />
                </div>

                <div class="sm:mx-auto sm:w-full sm:max-w-sm py-1">
                    <label htmlFor="email" class="block text-gray-700 text-sm font-bold mb-2"></label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter" minLength = "6" maxLength = "30" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                </div>
    
                <div class="sm:mx-auto sm:w-full sm:max-w-sm py-1">
                    <label htmlFor="password" class="block text-gray-700 text-sm font-bold mb-2" ></label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter" minLength = "8" maxLength = "30" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                </div>

                <div>
                    <button hidden={isComplete} class="mt-6 font-Inter bg-clip-text text-transparent bg-dark-tan-color" type="button" onClick={onComplete}>Register Account</button>
                </div>
                
    
                <div hidden={!isComplete} class="sm:mx-auto sm:w-full sm:max-w-sm py-2">
                    <ReCAPTCHA
                        sitekey="6LesuNEmAAAAAA3q7w3okrYkLzqlGf0iBL6cpXyV"
                        onChange={onChange}
                    />
                    <button disabled={!isVerified} hidden={!isVerified} class="mt-6 font-Inter bg-clip-text text-transparent bg-dark-tan-color" type="submit" >Register Account</button>
                </div>    
                <div>
                    <nav>
                        <ul>
                            <Link to="/login" class="mt-6 font-Inter bg-clip-text text-transparent bg-dark-tan-color" >Already have an account? Login here!</Link>
                        </ul>
                    </nav>
                </div>     
            </form>
        </div>
        )
}