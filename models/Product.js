const mongoose = require('mongoose');

const productScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'Title should be at least 4 characters long']
    },
    price: {
        type: String,
        // get: getPrice, 
        // set: setPrice,
        required: ['Prise is required'],
        min: [0, 'The price should be greater than 0.00'],
    },
    imageUrl: {
        type: String,
        required: ['Image is required'],
        validate: {
            validator: (v) => /^https?:\/\//,
            message: (props) => `Invalid URL`
        }
    },
    description: {
        type: String,
        required: ['Description is required'],
    },
    brand: {
        type: String,
    },
    boughtBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date || String,
        required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

// function getPrice(num){
//     return (num/100).toFixed(2);
// }

// function setPrice(num){
//     return num*100;
// }

module.exports = mongoose.model('Product', productScheme);