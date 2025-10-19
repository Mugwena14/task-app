const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    // AI / voice integration
    source: {
      type: String,
      enum: ['manual', 'voice'], 
      default: 'manual',
    },
    raw_text: {
      type: String, 
    },
    audioReference: {
      type: String, 
    },
    completed: { 
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Goal', goalSchema)
