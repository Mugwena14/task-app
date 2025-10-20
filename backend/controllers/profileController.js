const asyncHandler = require("express-async-handler");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const path = require("path");

// Generate image URLs
const getAvatarUrl = (req, avatarPath) => {
  if (!avatarPath) return "";
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  if (!avatarPath.startsWith("/")) avatarPath = `/${avatarPath}`;
  return `${baseUrl}${avatarPath}`;
};

// @desc    Get logged-in user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("User not found");

  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    profile = await Profile.create({
      user: req.user.id,
      bio: "",
      avatar: "",
    });
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
    bio: profile.bio,
    avatar: getAvatarUrl(req, profile.avatar),
  });
});

// @desc    Update user's profile (name, email, bio, avatar)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, bio } = req.body;

  if (!name?.trim() || !email?.trim()) {
    res.status(400);
    throw new Error("Name and email cannot be empty");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update user info
  user.name = name;
  user.email = email;
  await user.save();

  // Update or create profile
  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    profile = await Profile.create({
      user: req.user.id,
      bio: bio || "",
      avatar: req.file ? `/uploads/${req.file.filename}` : "",
    });
  } else {
    profile.bio = bio ?? profile.bio;
    if (req.file) {
      profile.avatar = `/uploads/${req.file.filename}`;
    }
    await profile.save();
  }

  // Return Profile Data
  res.status(200).json({
    name: user.name,
    email: user.email,
    bio: profile.bio,
    avatar: getAvatarUrl(req, profile.avatar),
  });
});

module.exports = { getProfile, updateProfile };
