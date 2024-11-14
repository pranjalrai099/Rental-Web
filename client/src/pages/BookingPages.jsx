import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDate";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null); // Fixed typo
  
  // Fetch booking details
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  // Fetch owner details
  useEffect(() => {
    if (booking && booking.place && booking.place.owner) {
      axios.get(`/userdetails/${booking.place.owner}`)
        .then(response => {
          setOwnerDetails(response.data);  // Set the fetched owner details
        })
        .catch(error => {
          console.error('Error fetching owner details:', error);
        });
    }
  }, [booking?.place?.owner]); // Use optional chaining to ensure booking.place.owner is available

  // Handle loading state
  if (!booking) {
    return <div>Loading...</div>; // Display loading state when booking data is not yet available
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place?.title}</h1>
         
      
      {booking.place && (
        <>
          <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
          <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-4">Your booking information:</h2>
              <BookingDates booking={booking} />
            </div>
            <div className="bg-red-500 p-6 text-white rounded-2xl">
              <div>Total price</div>
              <div className="text-3xl">${booking.price}</div>
            </div>
          </div>
          <PlaceGallery place={booking.place} />
        </>
      )}

      <div className="right-1 mb-4 mt-6 bg-gray-100">
        <p className="pl-2 pt-2 font-semibold text-xl text-gray-900">
          For any queries regarding this place:
        </p><br />
        <p className="pl-2 pb-4 font-semibold text-xl text-gray-800">
          Contact us:
          <p>{ownerDetails ? ownerDetails.name : 'Loading owner details...'}</p>
          <p>{ownerDetails ? ownerDetails.email : ''}</p>
        </p>
      </div>
    </div>
  );
}
