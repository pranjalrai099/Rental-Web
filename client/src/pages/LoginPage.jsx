import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setuser } = useContext(UserContext);

    async function handleLogin(ev) {
        ev.preventDefault(); // Corrected the method name
        try {
      const {data}=await axios.post('/login', { email, password });
        setuser(data);
        console.log(data);
        if(data){
            alert('Login Successful');
            setRedirect(true);
        }
        } catch (e) {
            console.log(e);
            alert("Login Failed");
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)} 
                    />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-700">
                        Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}


// import axios from "axios";
// import { useContext, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { UserContext } from "../UserContext.jsx";

// export default function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [redirect, setRedirect] = useState(false);
//     const {setUser}=useContext(UserContext);
//     async function handleLogin(ev) {
//         ev.preventDefault(); // Corrected the method name
//         try {
//            const {data}=await axios.post('/login', { email, password });
    
//             setUser(data);
    
//             alert('Login Successful');
//             setRedirect(true);
//         } catch (e) {
            
//             alert("Login Failed");
//         } 
//     }

//     if (redirect) {
//         return <Navigate to={'/'} />;
//     }

//     return (
//         <div className="mt-4 grow flex items-center justify-around">
//             <div className="mb-32">
//                 <h1 className="text-4xl text-center mb-4">Login</h1>
//                 <form className="max-w-md mx-auto" onSubmit={handleLogin}>
//                     <input 
//                         type="email" 
//                         placeholder="your@email.com" 
//                         value={email} 
//                         onChange={ev => setEmail(ev.target.value)} 
//                     />
//                     <input 
//                         type="password" 
//                         placeholder="password" 
//                         value={password} 
//                         onChange={ev => setPassword(ev.target.value)} 
//                     />
//                     <button className="primary">Login</button>
//                     <div className="text-center py-2 text-gray-700">
//                         Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }


// import axios from "axios";
// import { useState } from "react";
// import { Link, Navigate } from "react-router-dom"
// export default function LoginPage(){
//     const [email,setemail]=useState('');
//         const [password,setpassword]=useState('');
//         const [redirect,setredirect]=useState(false);
//     async function hanndlelogin(ev){
//         ev.preventDefault();
//        try{
//         await axios.post('/login',{email,password});
//         alert('Login Succesfull');
//    setredirect(true);
//        } catch(e){
//         alert("Login Failed");
//        } 
//     }
//     if(redirect){
//         return <Navigate to={'/'} />
//     }
//     return(
//         <div className="mt-4 grow flex items-center justify-around">
//             <div className="mb-32">
//             <h1 className="text-4xl text-center mb-4">Login</h1>
//             <form className="max-w-md mx-auto" onSubmit={hanndlelogin}>
//                 <input type="email" placeholder="your@email.com" 
//                 value={email} onChange={ev=> setemail(ev.target.value)} />
//                 <input type="password" placeholder="password"
//                  value={password} onChange={ev=> setpassword(ev.target.value)} />
//                 <button className="primary">Login</button>
//                 <div className="text-center py-2 text-gray-700">
//                     Don't have account yet? <Link className="underline text-black" to={'/register'}>Register now</Link> </div>
//             </form>
//             </div>
//         </div>
//     )
// };