import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation

export default function FilterbyGuest({ setFilterGuestMode, filterModeGuest }) {
  const [MinmGuest, setMinmGuest] = useState(''); // Minimum guest count
  const [MaxmGuest, setMaxmGuest] = useState(''); // Maximum guest count
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Input validation function
  const isValidInput = () => {
    return MinmGuest !== '' && MaxmGuest !== '' && parseFloat(MinmGuest) <= parseFloat(MaxmGuest);
  };

  // Handle save button to submit guest filtering data
  const handleSave = async () => {
    if (isValidInput()) {
      try {
        // Post the filtering request
        const response = await axios.post("/filterbyGuest", {
          minGuest: parseFloat(MinmGuest),
          maxGuest: parseFloat(MaxmGuest),
        });

        // Redirect to the /filterbyGuest page and pass the filtered places as state
        navigate('/filterbyGuest', { state: { places: response.data } });
        setFilterGuestMode(false); // Close the modal
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    }
  };

  return (
    <div>
      {filterModeGuest && ( // Using filterModeGuest to toggle the modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-500 p-16 rounded-3xl shadow-lg max-w-lg">
            <h2 className="text-2xl mb-4 font-semibold">Filter by Number of Guests</h2>

            <div className="mb-4">
              <label className="block mb-2 text-xl">Minimum Number of Guests</label>
              <input
                type="number"
                value={MinmGuest}
                onChange={(ev) => setMinmGuest(ev.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-xl">Maximum Number of Guests</label>
              <input
                type="number"
                value={MaxmGuest}
                onChange={(ev) => setMaxmGuest(ev.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${!isValidInput() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isValidInput()} // Disable if input is not valid
              >
                Save
              </button>
              <button
                onClick={() => setFilterGuestMode(false)} // Close the modal
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
