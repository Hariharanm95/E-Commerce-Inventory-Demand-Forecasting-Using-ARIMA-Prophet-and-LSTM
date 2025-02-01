const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        trim: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 // Ensure price cannot be negative
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0 // Ensure stock cannot be negative
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;