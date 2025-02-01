const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        trim: true //removes whitespaces
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Ensures no two users have the same email
        trim: true,
        lowercase: true, //Store email in lowercase
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //Basic validation format
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6 // Enforce minimum password length

    },
    isAdmin: { 
        type: Boolean, 
        default: false, // User is not admin by default
    },
    purchaseHistory: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Order' // Reference to the Order model
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;