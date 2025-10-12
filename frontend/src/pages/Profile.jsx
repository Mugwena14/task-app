import React, { useState } from "react";

const Profile = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("Langavi");
    const [email, setEmail] = useState("langavi@example.com");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-50">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center transition-all hover:shadow-md">
                
                {/* Profile Image */}
                <div className="relative group">
                <img
                    src={
                    image ||
                    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover mx-auto border border-gray-200 shadow-sm"
                />
                <label
                    htmlFor="profileUpload"
                    className="absolute bottom-0 right-[35%] bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    Change
                </label>
                <input
                    type="file"
                    id="profileUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                </div>

                {/* User Info */}
                <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-500 text-sm mt-1">{email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
