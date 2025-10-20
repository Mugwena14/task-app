const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

// Path for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", protect, getProfile);
router.put("/", protect, upload.single("avatar"), updateProfile);

module.exports = router;
