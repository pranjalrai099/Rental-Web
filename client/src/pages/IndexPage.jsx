import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function IndexPage() {
  const [places, setPlaces] = useState([]); // Corrected destructuring
  useEffect(() => {
    axios.get('/places').then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-40 " >
      {places.length > 0 && places.map((place) => (
        <Link className="" to={'/places/'+place._id}>
        <div className="bg-gray-500 mb-2 rounded-2xl flex" key={place._id}> {/* Add a unique key if using map */}
          {place.addedPhotos?.[0] && (
            <img className="rounded-2xl object-cover aspect-square" src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`} alt={place.title} />
          )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3> {/* Use a heading or paragraph for the title */}
        <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
            </div>
        </Link>
      ))}
       </div>
  );
}
