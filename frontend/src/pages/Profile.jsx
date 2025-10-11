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
    <div className="flex flex-col items-center p-6 max-w-sm mx-auto bg-white rounded-2xl shadow-md border border-gray-200">
      {/* Profile Photo */}
      <div className="relative">
        <img
          src={
            image ||
            "https://via.placeholder.com/150?text=Upload+Photo"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm"
        />
        <label
          htmlFor="profileUpload"
          className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-700"
        >
          Upload
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
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-500">{email}</p>
      </div>
    </div>
  );
};

export default Profile;
