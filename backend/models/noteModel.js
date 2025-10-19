const mongoose = require('mongoose')

const noteSchema = mongoose.Schema(
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        },
        title: {
        type: String,
        required: [true, 'Please add a title'],
        },
        content: {
        type: String,
        required: [true, 'Please add some content'],
        },
        summary: {
        type: String,
        default: '', 
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Note', noteSchema)
