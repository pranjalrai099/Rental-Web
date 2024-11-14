import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "./AddressLink";
import PlaceGallery from "./PlaceGallery";

export default function CartPlace() {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get('/cart').then(response => {
        const foundCart = response.data.find(({ _id }) => _id === id);
        if (foundCart) {
          setCart(foundCart);
        }
      });
    }
  }, [id]);

  // Fetch owner details
  useEffect(() => {
    if (cart?.place?.owner) {
      axios.get(`/userdetails/${cart.place.owner}`)
        .then(response => {
          setOwnerDetails(response.data);  // Set the fetched owner details
        })
        .catch(error => {
          console.error('Error fetching owner details:', error);
        });
    }
  }, [cart?.place?.owner]);

  // Handle loading state
  if (!cart) {
    return <div>Loading...</div>; // Display loading state when cart data is not yet available
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{cart.place?.title}</h1>

      {cart.place && (
        <>
          <AddressLink className="my-2 block">{cart.place.address}</AddressLink>
          <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
            {cart.place.description}
          </div>
          <PlaceGallery place={cart.place} />
        </>
      )}

      <div className="right-1 mb-4 mt-6 bg-gray-100">
        <p className="pl-2 pt-2 font-semibold text-xl text-gray-900">
          For any queries regarding this place:
        </p>
        <br />
        <p className="pl-2 pb-4 font-semibold text-xl text-gray-800">
          Contact us:
          <p>{ownerDetails ? ownerDetails.name : 'Loading owner details...'}</p>
          <p>{ownerDetails ? ownerDetails.email : ''}</p>
        </p>
      </div>
    </div>
  );
}
