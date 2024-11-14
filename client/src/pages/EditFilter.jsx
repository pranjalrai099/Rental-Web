import React, { useState } from "react";

const EditFilter = ({ setFilter }) => {
    const [minMoney, setMinMoney] = useState(null);
    const [maxMoney, setMaxMoney] = useState(null);

    const saveUser = () => {
        // Assuming you want to save the values to the filter
        setFilter({ minMoney, maxMoney });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-500 p-16 rounded-3xl shadow-lg max-w-lg">
                <h2 className="text-2xl mb-4 font-semibold">Edit Filter</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-xl">Minimum Money</label>
                    <input
                        type="number"
                        value={minMoney || ''}
                        onChange={(ev) => setMinMoney(ev.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-xl">Maximum Money</label>
                    <input
                        type="number"
                        value={maxMoney || ''}
                        onChange={(ev) => setMaxMoney(ev.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={saveUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setFilter(null)} // or some function to close the modal
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFilter;
