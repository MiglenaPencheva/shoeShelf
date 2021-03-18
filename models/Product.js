const mongoose = require('mongoose');

const productScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'Title should be at least 4 characters long']
    },
    description: {
        type: String,
        required: ['Description is required'],
        maxlength: [50, 'Description should be max 50 characters long']
    },
    imageUrl: {
        type: String,
        required: ['Image is required'],
        validate: {
            validator: (v) => /^https?:\/\//,
            message: (props) => `Invalid URL`
        }
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    likedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
});

module.exports = mongoose.model('Product', productScheme);