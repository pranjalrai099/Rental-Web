import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export function BookingWidget({ place,max }) {
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
  async function cartthisplace() {
    if(!user){
      toast.error('Please login first');
      } else{
        try {
          const response = await axios.post('/cart', {
            place: place._id,
            
          });
          console.log(response.data);
          const cartId = response.data._id;
          if (cartId) {
            setRedirect(`/account/my-cart`);
            toast.success("This Place is added to your cart..");
          } else {
            console.error("Booking ID not found");
            toast.error("Something Issue are there Not added in your cart.");
          }
        }
         catch (error) {
          console.error("Error:", error);  // To inspect the error for debugging
          // Handle error messages
          toast.error("An error occurred.");
        }
      }
    
  }
  async function bookThisPlace() { 
    if(!user){
    toast.error('Please login first');
    }  else{
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
  
      // Check if bookingId is returned and maxguest is valid
      if (bookingId && maxguest <= max) {
        setRedirect(`/account/bookings`);
        toast.success("Congratulations on your booking. Enjoy your trip!");
      } else {
        console.error("Booking ID not found");
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);  // To inspect the error for debugging
      // Handle error messages
      toast.error("An error occurred. Please fill all the deatils");
    }
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
          {maxguest>max && (
            <div>   
            <p className="text-red-400">no of guest exceed the maximum capacity of place</p>
          </div>
          )}
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
      <button onClick={bookThisPlace} className="primary mt-4 text-xl">
        Book this Place
        {numberofNights > 0 && <span> ${numberofNights * place.price}</span>}
      </button>
      <button onClick={cartthisplace} className="mt-2 w-full text-white text-xl bg-blue-600 rounded-full p-2 mb-1">Add to Cart</button>
    </div>
  );
}



