import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export function BookingWidget({ place }) {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [maxguest, setMaxguest] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const {user}=useContext(UserContext);
  useEffect(()=>{
  if(user){
    setName(user.name);
  }
  },[user]);
  let numberofNights = 0;
  if (checkin && checkout) {
    numberofNights = differenceInCalendarDays(new Date(checkout), new Date(checkin));
  }

  async function bookThisPlace() {
    try {
      const response = await axios.post('/bookings', {
        checkin,
        checkout,
        maxguest,
        name,
        phone,
        place: place._id,
        price: numberofNights * place.price,
      });

      console.log("Response data:", response.data); // Debugging

      const bookingId = response.data._id;
      if (bookingId) {
        setRedirect(`/account/bookings`);
      } else {
        console.error("Booking ID not found");
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      alert("Please login First");
    }
  }

  if (redirect) {
    console.log("Redirecting to:", redirect); // Debugging
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              className="cursor-pointer"
              value={checkin}
              onChange={(ev) => setCheckin(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              className="cursor-pointer"
              type="date"
              value={checkout}
              onChange={(ev) => setCheckout(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests:</label>
          <input
            type="number"
            className="cursor-pointer"
            value={maxguest}
            onChange={(ev) => setMaxguest(ev.target.value)}
          />
        </div>
        {numberofNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              className="cursor-pointer"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Your Contact No:</label>
            <input
              type="tel"
              className="cursor-pointer"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this Place
        {numberofNights > 0 && <span> ${numberofNights * place.price}</span>}
      </button>
    </div>
  );
}



// import { useState } from "react"
// import { differenceInCalendarDays } from "date-fns";
// import axios from "axios";
// import { Navigate } from "react-router-dom";
// export function BookingWidget({place}){
//     const [checkin, setcheckin] = useState('');
//     const [checkout, setcheckout] = useState('');
//     const [maxguest, setmaxguest] = useState(1);  
//     const [name,setname]=useState('');
//     const [phone,setphone]=useState('');
//     const [redirect,setredirect]=useState('');
//     let numberofNights=0;
//     if(checkin && checkout){
//         numberofNights=differenceInCalendarDays(new Date(checkout),new Date(checkin));
//     }
//    async function bookthisplace(){
//       const response= await axios.post('/bookings',{
//         checkin,checkout,maxguest,name,phone,
//             place:place._id,
//             price:numberofNights*place.price,
//    })
//    const bookingId=response.data._id;
//    setredirect(`/account/bookings/${bookingId}`);
//     };
//     if(redirect){
//         return <Navigate to={redirect}/>
//     }

//     return(
//         <div className="bg-white shadow rounded-2xl">
//               <div className="text-2xl text-center">
//               Price: ${place.price} / per night
//               </div>
//                 <div className="border rounded-2xl mt-4">
//               <div className="flex">
//               <div className=" py-3 px-4">
//             <label>Check in:</label>
//             <input type="date" className="cursor-pointer" value={checkin} onChange={ev=>setcheckin(ev.target.value)}  />
//             </div>
//             <div className=" py-3 px-4 border-l">
//             <label>Check out:</label>
//             <input className="cursor-pointer" type="date" value={checkout} onChange={ev=>setcheckout(ev.target.value)}/>
//             </div>
//               </div>
//              <div className=" py-3 px-4 border-t">
//             <label>Number of Guest:</label>
//             <input type="number" className="cursor-pointer" value={maxguest} onChange={ev=>setmaxguest(ev.target.value)}/>
//             </div>
//             {numberofNights>0 && (
//                 <div className=" py-3 px-4 border-t">
//                 <label>Your full name:</label>
//                 <input type="text" className="cursor-pointer" value={name} onChange={ev=>setname(ev.target.value)}/>
//                 <label>Your Contact No:</label>
//                 <input type="tel" className="cursor-pointer" value={phone} onChange={ev=>setphone(ev.target.value)}/>
//                 </div>
//             )}
//                 </div>
//             <button onClick={bookthisplace} className="primary mt-4">
//                 Book this Place
//                 {numberofNights>0 && (
//                   <span> ${numberofNights*place.price}</span>  
//                 )}
//                 </button>
//             </div>
//     )
// }