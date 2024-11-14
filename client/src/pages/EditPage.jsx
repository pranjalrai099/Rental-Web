import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditProfileModal({ user, setEditMode }) {
    const [name, setName] = useState(user.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
     const [oldpassword,setoldpassword]=useState(null);
    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);
   
    async function saveUser(ev) {
        ev.preventDefault();
    
        // Simple validation for matching passwords
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
    
        // Check if at least one field is updated
        if (!name && !password) {
            toast.info("Please provide a name or password to update.");
            return;
        }
    
        const UserData = {
            name,
            password,
        };
    
        try {
            // Make sure 'id' is coming from the user prop or context
            const response = await axios.put('/profile/' + user._id, UserData);
          
            // If successful, exit edit mode
            setEditMode(false);
            toast.success('Profile updated successfully');
            console.log('Profile updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            toast.error("An error occurred while updating your profile. Please try again.");
        }
    }    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-500 p-16 rounded-3xl shadow-lg max-w-lg">
                <h2 className="text-2xl mb-4 font-semibold">Edit Profile</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-xl">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
              
                <div className="mb-4">
                    <label className="block mb-2 text-xl">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-xl">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
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
                        onClick={() => setEditMode(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
