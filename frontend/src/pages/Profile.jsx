import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchProfile, updateProfile } from "../features/profile/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, isLoading, message } = useSelector((state) => state.profile || {});
  const { user: loggedUser } = useSelector((state) => state.auth) || {};
  const token = loggedUser?.token;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
  );
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile
  useEffect(() => {
    if (token) dispatch(fetchProfile());
  }, [dispatch, token]);

  // Only update form fields if profile changed
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        bio: profile.bio || prev.bio,
        avatar: profile.avatar || prev.avatar,
      }));

      setPreview(
        profile.avatar?.startsWith("http")
          ? profile.avatar
          : profile.avatar
          ? `${import.meta.env.VITE_BASE_URL || ""}/${profile.avatar}`
          : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
      );
    }
  }, [profile]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email cannot be empty");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    if (image) data.append("avatar", image);

    dispatch(updateProfile(data))
      .unwrap()
      .then((updatedProfile) => {
        setFormData({
          name: updatedProfile.name,
          email: updatedProfile.email,
          bio: updatedProfile.bio || "",
          avatar: updatedProfile.avatar || "",
        });

        setPreview(
          updatedProfile.avatar?.startsWith("http")
            ? updatedProfile.avatar
            : updatedProfile.avatar
            ? `${import.meta.env.VITE_BASE_URL || ""}/${updatedProfile.avatar}`
            : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
        );
      })
      .catch((err) => {
        setError(err || "Failed to update profile");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 hover:text-black transition-all text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center"
      >
        {/* Avatar */}
        <div className="relative group mx-auto w-28 h-28">
          <img
            src={preview}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mx-auto border border-gray-200 shadow-sm transition-all duration-200"
          />
          <label
            htmlFor="profileUpload"
            className="absolute bottom-1 right-1 bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="mt-6 text-left space-y-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="mt-6 w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-all"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
