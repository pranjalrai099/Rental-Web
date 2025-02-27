import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDate";
import { toast } from "react-toastify";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [nooflike,setnooflike]=useState(0);
  const [noofdislike,setnoofdislike]=useState(0);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
        
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (booking?.place?.owner) {
      axios
        .get(`/userdetails/${booking.place.owner}`)
        .then((response) => setOwnerDetails(response.data))
        .catch((error) => console.error("Error fetching owner details:", error));
    }
  }, [booking?.place?.owner]);

  if (!booking) return <div>Loading...</div>;
  const handleSubmitComment = async () => {
    if (comment.trim() === "") return;

    try {
      const response = await axios.post(`/places/${booking.place._id}/comment`, {
        text: comment,
      });
      setComments(response.data.comments);
      setComment("");
      toast.success('Your comments is submitted.')
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error('There is some error');
    }
  };

  const handleLike = async () => {
    if (dislike) return; // Prevent liking if already disliked
  
    try {
      const newLikedState = !liked;
      setLiked(newLikedState);
      await axios.post(`/places/${booking.place._id}/like`, {
        liked: newLikedState,
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  
  const handleDislike = async () => {
    if (liked) return; // Prevent disliking if already liked
  
    try {
      const newDislikedState = !dislike;
      setDislike(newDislikedState);
  
      await axios.post(`/places/${booking.place._id}/dislike`, {
        disliked: newDislikedState,
      });
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };
  
 console.log(booking.place);
  return (
    <div className="my-8">
      <h1 className="text-4xl mb-2">{booking.place?.title}</h1>
      {booking.place && (
        <>
          <AddressLink className="my-2 block text-lg text-gray-800">{booking.place.address}</AddressLink>
          <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between shadow-md">
            <div className="">
              <h2 className="text-2xl mb-4 font-semibold">Your booking information:</h2>
              <BookingDates  booking={booking} />
            </div>
            <div className="bg-red-500 p-6  text-white rounded-2xl">
              <div className="text-lg font-medium">Total price</div>
              <div className="text-3xl font-bold">${booking.price}</div>
            </div>
          </div>
          <PlaceGallery place={booking.place} />
        </>
      )}

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6">
        <p className="font-semibold text-xl text-gray-900">For any queries regarding this place:</p>
        <p className="mt-2 text-gray-800 text-2xl">Contact: {ownerDetails ? ownerDetails.name : "Loading owner details..."}</p>
        <p className="text-gray-800 text-2xl">Email: {ownerDetails?.email || ""}</p>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
        <textarea
          className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex space-x-72">
      <div className="mt-4 flex space-x-4">
        <button
         className={`px-4 py-2 rounded-lg text-white ${
          liked ? "bg-red-500" : "bg-gray-500"
        }`}
          onClick={handleLike}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
        </button>
        <button
         className={`px-4 py-2 rounded-lg text-white ${
          dislike ? "bg-red-500" : "bg-gray-500"
        }`}
          onClick={handleDislike}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
</svg>
        </button>
      </div>
      <button
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-500"
          onClick={handleSubmitComment}
        >
          Submit
        </button>
      </div>
    </div>
    </div>
  );
}
