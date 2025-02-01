const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Register a new user
// @route   POST /auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input data (add more validations as needed)
        if (!username || !email || !password) {
            return res.status(400).json(apiResponse({ message: 'Please fill all fields.' }, 400, false));
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
           return res.status(400).json(apiResponse({ message: 'User already exists' }, 400, false));
        }


        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        // Create JWT Token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d' // Token expires in 7 days
        });

      return res.status(201).json(apiResponse({ message: 'User registered successfully', user: savedUser, token }));
    }
    catch (error) {
        console.error('Error during signup:', error);
       return res.status(500).json(apiResponse({ message: 'Signup failed. Please try again later.' }, 500, false));
    }
};

// @desc    Login a user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
           return res.status(400).json(apiResponse({ message: 'Invalid credentials' }, 400, false));
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json(apiResponse({ message: 'Invalid credentials' }, 400, false));
      }

      // Create JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

        return res.status(200).json(apiResponse({ message: 'Login successful', user, token }));

    } catch (error) {
         console.error('Error during login:', error);
         return res.status(500).json(apiResponse({ message: 'Login failed. Please try again later.' }, 500, false));
    }
};

// @desc    Get logged in user data
// @route   GET /auth/me
// @access  Private (Requires JWT)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
         if (!user) {
          return res.status(404).json(apiResponse({ message: 'User not found' }, 404, false));
        }

         return res.status(200).json(apiResponse({ user: user}, 200, true));
    } catch (error) {
          console.error('Error getting logged in user:', error);
         return res.status(500).json(apiResponse({ message: 'Could not get user. Please try again later.' }, 500, false));
    }
};