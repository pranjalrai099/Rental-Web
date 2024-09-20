import PhotosUploader from "../PhotosUploader";
import PerksLabel from "../Perks";
import { useEffect, useState } from "react";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
export default function PlacesForm(){
  const {id}=useParams();
    const [title, settitle] = useState('');
  const [address, setaddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setdescription] = useState('');
  const [perks, setperks] = useState([]);
  const [extraInfo, setextraInfo] = useState('');
  const [checkin, setcheckin] = useState('');
  const [checkout, setcheckout] = useState('');
  const [maxguest, setmaxguest] = useState(1);
  const [price,setPrice]=useState(100);
   const [redirect,setredirect]=useState(false);
  
   useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/places/' + id)
      .then(response => {
        const data = response.data;
        console.log(6);
        console.log(data); // Inspect the fetched data
  
        settitle(data.title || ''); // Fallback to empty string if no title
        setaddress(data.address || ''); // Fallback to empty string if no address
        setAddedPhotos(data.addedPhotos || []); // Default to empty array if no photos
        setdescription(data.description || ''); // Default to empty string if no description
        setperks(data.perks || []); // Default to empty array if no perks
        setextraInfo(data.extraInfo || ''); // Default to empty string if no extraInfo
        setcheckin(data.checkin || ''); // Default to empty string if no checkin
        setcheckout(data.checkout || ''); // Default to empty string if no checkout
        setmaxguest(data.maxguest || 1); // Default to 1 if no max guest
        setPrice(data.price || 0);
      })
      .catch(error => {
        console.error("Error fetching place:", error);
      });
  }, [id]);
  
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preinput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev){
    ev.preventDefault();
    const PlaceData = {
      title,
      address,
       addedPhotos,
      description,
      perks,
      extraInfo,
      checkin, // Send checkin as string
      checkout,
      maxguest: parseInt(maxguest), // Ensure maxguest is a number
      price,
    };
    
    if (id) {
      // Update
      await axios.put('/places/' + id, { id, ...PlaceData });
      setredirect(true);
    } else {
      // New place
      await axios.post('/places', PlaceData);
      setredirect(true);
   }
  }
  
 if(redirect){
    return <Navigate to={'/account/places'} />
 }
 console.log(addedPhotos);
    return(
        <div>
            <AccountNav/>
        <form onSubmit={savePlace}>
          {preinput('Title', 'Title for your place, should be short and catchy')}
          <input type="text" value={title} onChange={ev => settitle(ev.target.value)} placeholder="Title, for example: My lovely apartment" />

          {preinput('Address', 'Address to the place')}
          <input type="text" value={address} onChange={ev => setaddress(ev.target.value)} placeholder="Address" />

          {preinput('Photos', 'Upload more photos for better representation')}
          <PhotosUploader addedPhotos={addedPhotos} onchange={setAddedPhotos} />

          {preinput('Description', 'Description of your place')}
          <textarea value={description} onChange={ev => setdescription(ev.target.value)} />

          {preinput('Perks', 'Select all the perks of your place')}
          <div className="mt-4 grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <PerksLabel selected={perks} onChange={setperks} />
          </div>

          {preinput('Extra Info', 'House rules, etc.')}
          <textarea value={extraInfo} onChange={ev => setextraInfo(ev.target.value)} />

          {preinput('Check-in & Check-out times', 'Add check-in and check-out times')}
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Check-in time</h3>
              <input type="text" value={checkin} onChange={ev => setcheckin(ev.target.value)} placeholder="14:00" />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check-out time</h3>
              <input type="text" value={checkout} onChange={ev => setcheckout(ev.target.value)} placeholder="20:00" />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Max number of guests</h3>
              <input type="Number" value={maxguest} onChange={ev => setmaxguest(ev.target.value)} placeholder="5" />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Price per night</h3>
              <input type="Number" value={price} onChange={ev => setPrice(ev.target.value)} placeholder="100" />
            </div>
          </div>
          <div className="">
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    )
}