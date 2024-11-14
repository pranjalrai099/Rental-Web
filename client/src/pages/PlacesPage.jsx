import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from 'axios';
import PlaceImg from "../PlaceImg";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

export default function PlacePage() {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const removeFromPlaces = async (itemId) => {
    try {
      await axios.delete(`/places/${itemId}`);
      setPlaces(prevPlaces => prevPlaces.filter(item => item._id !== itemId));
      navigate('/account/places');
      toast.success("Item removed from Your Accommodation successfully!");
      
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from Your accommodation.");
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-red-600 text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-y-6">
        {places.length > 0 && places.map(place => (
          <Link key={place._id} to={'/account/places/' + place._id} className="flex cursor-pointer shadow-md gap-9 bg-gray-100 p-4 rounded-2xl">
            <div className="flex w-40 h-32 bg-gray-300 shrink-0">
              <PlaceImg place={place} />
            </div>
            <div>
              <button onClick={() => removeFromPlaces(place._id)} className="-mt-3 rounded-all text-xl absolute right-0 mr-10 p-3 flex gap-2 text-white bg-blue-700 pt-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                Remove
              </button>
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
