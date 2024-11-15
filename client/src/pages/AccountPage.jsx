import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacePage from "./PlacesPage";
import AccountNav from "./AccountNav";
import { ProfileView } from "./ProfileView";
import EditProfileModal from "./EditPage";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
        toast.info("Succesfully Logout")
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
   
    
       
    };

    const saveChanges = async () => {
        try {
            const res = await axios.put('/api/user/update', { 
                name: user.name,
                email: user.email 
            }); // Adjust API call as needed
            if (res.data.success) {
                setEditMode(false); // Close edit mode after saving
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const editpage = () => {
        setEditMode(true); // Open the edit mode dialog
    };

    // if (!ready) {
    //     return 'Loading...';
    // }
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
   
    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <ProfileView
                    user={user} 
                    editpage={editpage} 
                    logout={logout}
                />
            )}

            {editMode && (
                <EditProfileModal 
                    user={user} 
                    handleEditChange={handleEditChange} 
                    saveChanges={saveChanges} 
                    setEditMode={setEditMode} 
                />
            )}

            {subpage === 'places' && <PlacePage />}
        </div>
    );
}






