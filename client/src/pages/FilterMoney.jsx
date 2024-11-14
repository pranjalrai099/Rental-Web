import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation

export default function FilterbyMoney({ setFilterMoneyMode, filterModeMoney }) {
  const [MinmMoney, setMinmMoney] = useState('');
  const [MaxmMoney, setMaxmMoney] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Input validation function
  const isValidInput = () => {
    return MinmMoney !== '' && MaxmMoney !== '' && parseFloat(MinmMoney) <= parseFloat(MaxmMoney);
  };

  // Handle save button to submit data
  const handleSave = async () => {
    if (isValidInput()) {
      console.log(8);
      try {
        // Post the filtering request
        const response = await axios.post("/filterbyMoney", {
          minPrice: parseFloat(MinmMoney),
          maxPrice: parseFloat(MaxmMoney),
        });
        
        setFilterMoneyMode(false);
        // Redirect to the /filterbymoney page and pass the placesByRange as state
        navigate('/filterbyMoney', { state: { places: response.data } });
         // Close the modal
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    }
  };

  return (
    <div>
      {filterModeMoney && ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-500 p-16 rounded-3xl shadow-lg max-w-lg">
            <h2 className="text-2xl mb-4 font-semibold">Give input for filtering by Money</h2>

            <div className="mb-4">
              <label className="block mb-2 text-xl">Minimum Amount of Money in Dollars</label>
              <input
                type="number"
                value={MinmMoney}
                onChange={(ev) => setMinmMoney(ev.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-xl">Maximum Amount of Money in Dollars</label>
              <input
                type="number"
                value={MaxmMoney}
                onChange={(ev) => setMaxmMoney(ev.target.value)}
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
                onClick={() => setFilterMoneyMode(false)} // Close the modal
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
