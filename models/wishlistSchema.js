const mongoose = require('mongoose');


const wishlistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    myWish: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',

            }
        }
    ]

})

module.exports = mongoose.model('Wishlist', wishlistSchema)