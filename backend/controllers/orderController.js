const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Create a new order (handles payment processing)
// @route   POST /orders/checkout
// @access  Private (Requires JWT)
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
         if (!shippingAddress){
           return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
        }
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
         if (!cart || cart.items.length === 0) {
            return res.status(400).json(apiResponse({ message: 'Your cart is empty.' }, 400, false));
        }

        let totalAmount = 0;
         const orderItems = await Promise.all(cart.items.map(async item => {
             if (item.product.stock < item.quantity){
                  return res.status(400).json(apiResponse({ message: `Insufficient stock for product : ${item.product.name}` }, 400, false));
            }
            const newStock = item.product.stock - item.quantity;
             await Product.findByIdAndUpdate(item.product._id, {stock: newStock});

             totalAmount += item.product.price * item.quantity;
             return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            };
         }));

         if(orderItems.message){
          return  res.status(400).json(orderItems);
         }

        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress
        });
        const savedOrder = await newOrder.save();
        await Cart.deleteOne({ user: req.user.id }); // Clear the cart after checkout

        return res.status(201).json(apiResponse({ message: 'Order created successfully', order: savedOrder }, 201, true));
    }
    catch (error) {
          console.error('Error during order checkout:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to create order. Please try again later.' }, 500, false));
    }
};

// @desc    Get user's order history
// @route   GET /orders
// @access  Private (Requires JWT)
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product');
       return res.status(200).json(apiResponse({ orders: orders }, 200, true));
    }
    catch (error) {
          console.error('Error during get user orders:', error);
          return res.status(500).json(apiResponse({ message: 'Failed to retrieve orders. Please try again later.' }, 500, false));
    }
};

// @desc    Get a specific order
// @route   GET /orders/:id
// @access  Private (Requires JWT)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json(apiResponse({ message: 'Order not found.' }, 404, false));
        }
        return res.status(200).json(apiResponse({ order: order }, 200, true));
    }
    catch (error) {
        console.error('Error during get order by id:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to retrieve order. Please try again later.' }, 500, false));
    }
};

// @desc    Update order status by ID
// @route   POST /orders/:id/updateStatus
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
      const { status } = req.body;
       if (!status){
          return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
        }
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
         if (!updatedOrder) {
              return res.status(404).json(apiResponse({ message: 'Order not found.' }, 404, false));
          }
         return res.status(200).json(apiResponse({ message: 'Order status updated successfully', order: updatedOrder}, 200, true));

  }
    catch (error) {
          console.error('Error during update order status:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to update order status. Please try again later.' }, 500, false));
    }
};