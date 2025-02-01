const Cart = require('../models/cart');
const Product = require('../models/product');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get user's cart
// @route   GET /cart
// @access  Private (Requires JWT)
exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart){
             return res.status(200).json(apiResponse({ message: 'Cart is empty', cart: {} }, 200, true));
        }
        return res.status(200).json(apiResponse({ cart: cart }, 200, true));
    }
    catch (error) {
        console.error('Error during get user cart:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to retrieve cart. Please try again later.' }, 500, false));
    }
};

// @desc    Add item to cart
// @route   POST /cart/add
// @access  Private (Requires JWT)
exports.addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity){
          return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(apiResponse({ message: 'Product not found.' }, 404, false));
        }
        if (product.stock < quantity) {
            return res.status(400).json(apiResponse({ message: 'Not enough stock available.' }, 400, false));
        }
        let cart = await Cart.findOne({ user: req.user.id });
         if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
         }
         const existingItem = cart.items.find(item => item.product.toString() === productId);
         if (existingItem) {
            existingItem.quantity += quantity;
         } else {
              cart.items.push({ product: productId, quantity });
         }
        await cart.save();
         return res.status(200).json(apiResponse({ message: 'Item added to cart successfully', cart: cart }, 200, true));
    }
    catch (error) {
          console.error('Error during adding item to cart:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to add item to cart. Please try again later.' }, 500, false));
    }
};

// @desc    Remove item from cart
// @route   POST /cart/remove
// @access  Private (Requires JWT)
exports.removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

         if (!productId){
           return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
         }

         let cart = await Cart.findOne({ user: req.user.id });
         if (!cart) {
             return res.status(404).json(apiResponse({ message: 'Cart not found' }, 404, false));
         }
         cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
      return res.status(200).json(apiResponse({ message: 'Item removed from cart successfully', cart: cart }, 200, true));
    }
    catch (error) {
          console.error('Error during remove item from cart:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to remove item from cart. Please try again later.' }, 500, false));
    }
};

// @desc    Update cart item quantity
// @route   POST /cart/update/:id
// @access  Private (Requires JWT)
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
       const productId = req.params.id;

         if (!quantity || !productId){
            return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
         }
          let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json(apiResponse({ message: 'Cart not found' }, 404, false));
        }
        const itemToUpdate = cart.items.find(item => item.product.toString() === productId);

          if (!itemToUpdate) {
            return res.status(404).json(apiResponse({ message: 'Item not found in cart' }, 404, false));
           }
         itemToUpdate.quantity = quantity;
         await cart.save();
       return res.status(200).json(apiResponse({ message: 'Cart item updated successfully', cart: cart }, 200, true));
    }
    catch (error) {
         console.error('Error during update cart item:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to update cart item. Please try again later.' }, 500, false));
    }
};


// @desc    Clear all products from cart
// @route   DELETE /cart
// @access  Private (Requires JWT)
exports.clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
              return res.status(404).json(apiResponse({ message: 'Cart not found' }, 404, false));
        }
        cart.items = [];
       await cart.save();
        return res.status(200).json(apiResponse({ message: 'Cart cleared successfully', cart: cart }, 200, true));
    }
    catch (error) {
         console.error('Error during clear cart:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to clear cart. Please try again later.' }, 500, false));
    }
};