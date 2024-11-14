import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BookingWidget } from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacesinPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState(null); // Fixed typo "ownerdeatils"

    // Fetch place data
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    // Fetch owner details
    useEffect(() => {
        if (place && place.owner) {
            axios.get(`/userdetails/${place.owner}`)
                .then(response => {
                    setOwnerDetails(response.data);  // Set the fetched owner details
                })
                .catch(error => {
                    console.error('Error fetching owner details:', error);
                });
        }
    }, [place?.owner]); // Use optional chaining to avoid undefined errors

    // If place data is not yet loaded, show nothing
    if (!place) {
        return '';
    }

    return (
        <div className="mt-4 px-8 pt-8 bg-gray-100 -mx-8">
            <h1 className="text-3xl">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place} />
            <div className="mb-4 mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    <b>Check-in:</b> {place.checkin}<br />
                    <b>Check-out:</b> {place.checkout}<br />
                    <b>Max number of guests:</b> {place.maxguest}
                </div>
                <div>
                    <BookingWidget place={place} max={place.maxguest} />
                </div>
            </div>

            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra Information</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
                    {place.extraInfo}
                </div>
                <div className="right-1 mb-4 mt-6 bg-gray-100">
                    <p className="pl-2 pt-2 font-semibold text-xl text-gray-900">
                        For any queries regarding this place:
                    </p><br />
                    <p className="pl-2 pb-4 font-semibold text-xl text-gray-800">
                        Contact us:
                        <p className="text-xl">{ownerDetails ? ownerDetails.name : 'Loading...'}</p>
                        <p className="text-xl">{ownerDetails ? ownerDetails.email : ''}</p> {/* Display owner email when available */}
                    </p>
                </div>
            </div>
        </div>
    );
}
