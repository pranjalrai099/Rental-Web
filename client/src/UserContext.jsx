import { createContext, useState,useEffect } from "react";
import axios from "axios";
export const UserContext=createContext({});
export function UserContextProvider({children}){
    const [user,setuser]=useState(null);
    const [ready,setready]=useState(false);
    useEffect(()=>{
        // console.log('hello')
         if(!user){
          const {data}=axios.get('/profile').then(({data})=>{
            setuser(data);
            setready(true);
            console.log(data);
          });
         }
    },[]);
    return(
<UserContext.Provider value={{user,setuser,ready}}>
{children}
</UserContext.Provider>
    );
}