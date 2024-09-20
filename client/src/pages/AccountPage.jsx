import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacePage from "./PlacesPage";
import AccountNav from "./AccountNav";
export default function ProfilePage(){
    const [redirect,setredirect]=useState(null);
    const {ready,user,setuser}=useContext(UserContext); // Do not reverse the order as ir assign this use chatgpt for this 
    let {subpage}=useParams();
    if(subpage===undefined){
        subpage='profile';
    }
    // console.log(5);
    async function logout(){
       await axios.post('/logout');
       setredirect('/');
       setuser(null);
    }
    if(!ready){
        return 'Loading...';
    }
    if(ready && !user && !redirect){
        return <Navigate to={'/login'} />
    }
   

    if(redirect){
        return <Navigate to={redirect} />
    }
    return(
        <div>
        <AccountNav/>
        {subpage === 'profile' && (
            <div className="text-center max-w-lg mx-auto">
            <p><b>Name:</b>{user.name}</p> <br />
            <p><b>Email id:</b>{user.email}</p> <br />
            <button onClick={logout} className="primary max-w-sm mt-2">Log Out</button>
            </div>
        )}
        {subpage=='places' && (
           <PlacePage />
        )}
        </div>
    );
}