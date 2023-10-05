const mongoose = require ('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true,     
        },
        message: {
            type: String,
            trim: true,
            maxLength: 500,
        },
        picture: {
            type: String,       
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true,
        },
        comments : {
            type: [
                {
                    commnenterId: String,
                    commnenterPseudo: String,
                    text: String,
                    timestamps: Number,
                }
            ],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('posts', PostSchema);