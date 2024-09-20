import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){
    const [name,setname]=useState('');
        const [email,setemail]=useState('');
        const [password,setpassword]=useState('');
        const navigate = useNavigate();
        function registeruser(ev){
            ev.preventDefault();
            axios.post('/register', {
                name: name ,
                email: email ,
                password  :password,
              })
              .then(function (response) {
                alert("Registeration Complete. You can login.")
                navigate('/login');
              })
              .catch(function (error) {
                console.log(error);
                alert("Regsiteration Failed");
              });
        }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registeruser}>
                <input type="text" placeholder="John Doe"
                value={name} onChange={ev=> setname(ev.target.value)} />
                <input type="email" placeholder="your@email.com"
                value={email} onChange={ev=> setemail(ev.target.value)} />
                <input type="password" placeholder="password" 
                value={password} onChange={ev=> setpassword(ev.target.value)} />
                <button className="primary">Register</button>
                <div className="text-center py-2 text-gray-700">
                    Already have account yet? <Link className="underline text-black" to={'/login'}>Login</Link> </div>
            </form>
            </div>
        </div>
    )
};