import React from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation to get state data

export default function FilteredGuest() {
  const location = useLocation();
  const places = location.state?.places || []; // Get the passed places data or use an empty array as fallback

  return (
    <div className="mt-5 flex flex-col gap-8">
      <h1 className="p-2 text-3xl text-gray-900">
        Available places for your selected guest count
      </h1>
      <div className="mb-14 mt-4 grid sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
        {places.length > 0 ? (
          places.map((place) => (
            <Link to={`/places/${place._id}`} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.addedPhotos && place.addedPhotos.length > 0 ? (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={`https://rental-web-1-backend.onrender.com/uploads/${place.addedPhotos[0]}`}
                    alt={place.title}
                  />
                ) : (
                  <div className="rounded-2xl aspect-square bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700">No Image</span>
                  </div>
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">{place.maxguest} Guests</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full">
            <b className="text-3xl text-gray-600">No any Place..</b>
         <img src="https://as2.ftcdn.net/jpg/01/32/37/79/500_F_132377917_YL0Eq2Eqb9CzLbkFwN992l4ZnrALdfg1.jpg" alt=""/>
       </div>
        )}
      </div>
    </div>
  );
}
