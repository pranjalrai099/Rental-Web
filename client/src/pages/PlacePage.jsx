import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BookingWidget } from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacesinPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState(4);

    // Fetch place data
    useEffect(() => {
        if (!id) return;
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    // Fetch owner details
    useEffect(() => {
        if (place && place.owner) {
            axios.get(`/userdetails/${place.owner}`)
                .then(response => setOwnerDetails(response.data))
                .catch(error => console.error('Error fetching owner details:', error));
        }
    }, [place?.owner]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/places/${id}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [id]);
  console.log(comments);
    // Show more comments (increments by 4)
    const handleShowMore = () => {
        setVisibleComments(prev => prev + 4);
    };

    if (!place) return '';

    return (
        <div className="mt-4 px-6 md:px-8 pt-8 bg-zinc-50">
            <h1 className="text-3xl">{place.title}</h1>

            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place} />

            <div className="mb-4 mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        <div className="text-zinc-800 text-lg">{place.description}</div>
                    </div>
                    <b>Check-in:</b> {place.checkin}<br />
                    <b>Check-out:</b> {place.checkout}<br />
                    <b>Max number of guests:</b> {place.maxguest}
                </div>
                <div>
                    <BookingWidget place={place} max={place.maxguest} />
                </div>
            </div>

            <div className="bg-white -mx-6 md:-mx-8 px-6 md:px-8 py-8 border-t">
                <h2 className="font-semibold text-2xl">Extra Information</h2>
                <div className="mt-2 text-xl font-semibold text-zinc-600 leading-5">
                    {place.extraInfo}
                </div>

                <div className="right-1 mb-4 mt-6 bg-zinc-50 p-4 rounded-md">
                    <p className="font-semibold text-xl text-gray-900">
                        For any queries regarding this place:
                    </p>
                    <p className="font-semibold text-xl text-gray-800 mt-2">
                        Contact us:
                        <p className="text-lg">{ownerDetails ? ownerDetails.name : 'Loading...'}</p>
                        <p className="text-lg">{ownerDetails?.email}</p>
                    </p>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white -mx-6 md:-mx-8 px-6 md:px-8 py-8 border-t">
                <h2 className="font-semibold text-2xl mb-4">Reviews by Latest Bookings</h2>
                <div className="flex mb-4 flex-rows justify-center gap-14">
                    <div className="p-2  text-green-500 text-3xl" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg> <p className="text-gray-700">{place.likes}</p></div>
                    <div className="p-2 text-red-500 text-3xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
</svg> <p className="text-gray-700">{place.dislikes}</p></div>
                    <div className="p-2 text-blue-500 text-3xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg> <p className="text-gray-700">{place.comments.length}</p></div>
                </div>
                <div className="space-y-4">
                    {comments.slice(0, visibleComments).map((comment, index) => (
                        <div key={index} className="p-4 bg-zinc-50 rounded-lg shadow-md">
                            <p className="flex text-2xl font-bold text-gray-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>{comment.user?.name || "Anonymous"}</p>
                            <p className="mt-1 p-2 text-black">{comment.text}</p>
                        </div>
                    ))}
                </div>
                {visibleComments < comments.length && (
                    <button
                        onClick={handleShowMore}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        View More
                    </button>
                )}
            </div>
        </div>
    );
}
