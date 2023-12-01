// requiring mongoose library
const mongoose = require('mongoose');

// define the note's database schema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            require: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // add the favoriteCount property
        favoriteCount: {
            type: Number,
            default: 0
        },
        // add the favoritedBy property
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        // assign createdAt and updatedAt fields with a Date Type
        timestamps: true
    }
);

// define the 'note' model with the schema
const Note = mongoose.model('Note', noteSchema);
// export the module
module.exports = Note;