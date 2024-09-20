import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from 'axios';
import PlaceImg from "../PlaceImg";
export default function PlacePage() {
  const [places, setplaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setplaces(data);
    });
  }, []);
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
          <Link to={'/account/places/' + place._id} className="flex cursor-pointer shadow-md gap-9 bg-gray-100 p-4 rounded-2xl">
            <div className="flex w-40 h-32 bg-gray-300 shrink-0" >
             <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2" >{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}






