const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        },
        name: { type: String },
        email: { type: String },
        bio: { type: String, default: "" },
        avatar: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
