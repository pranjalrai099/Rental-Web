import React from "react";
import { EditIcon } from "./EditIcon";
export function ProfileView({ user, editpage, logout }) {

    return (
        <div className="flex gap-10 text-center max-w-lg mx-auto">
            <div>
                <img className="w-56 h-56" src="https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg" alt="Profile" />
            </div>
            <div className="mt-7 text-xl flex-col gap-9">
                <p className="flex gap-3 text-2xl mb-4">
                    <b className="flex text-2xl gap-1">Name: </b>{user.name}
                </p>
                <p className="flex gap-3 text-xl mb-5">
                    <b className="flex text-2xl gap-1">Email id: </b>{user.email}
                </p>
                <div className="flex gap-5">
                    <button onClick={editpage} className="flex primary mt-1">
                        <EditIcon />
                        <p className="ml-2 text-2xl">Edit</p>
                    </button>
                    <button onClick={logout} className="primary mt-1">Log Out</button>
                </div>
            </div>
        </div>
    );
}