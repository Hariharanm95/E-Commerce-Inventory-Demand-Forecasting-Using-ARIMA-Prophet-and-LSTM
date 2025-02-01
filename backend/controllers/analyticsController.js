const Order = require('../models/order');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get sales data for graphs and reports
// @route   GET /analytics/sales
// @access  Private (Admin)
exports.getSalesData = async (req, res) => {
    try {
        const orders = await Order.find({});
      const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
      const orderCount = orders.length;
       const salesData = {
           totalRevenue,
           orderCount
       }
       return res.status(200).json(apiResponse({ salesData: salesData }, 200, true));
    }
    catch (error) {
          console.error('Error during get sales data:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to retrieve sales data. Please try again later.' }, 500, false));
    }
};

// @desc    Get data about best selling products
// @route   GET /analytics/bestselling
// @access  Private (Admin)
exports.getBestSellingProducts = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.product');
      const productSales = {}
      orders.forEach(order => {
          order.items.forEach(item => {
              if(!productSales[item.product.name]){
                  productSales[item.product.name] = item.quantity
              } else {
                  productSales[item.product.name] += item.quantity;
              }
          })
      });

       const sortedProducts = Object.entries(productSales).sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
       const bestSellingProducts = sortedProducts.slice(0, 5).map(([name, sales]) => ({name, sales}));

     return res.status(200).json(apiResponse({ bestSellingProducts: bestSellingProducts }, 200, true));
  }
   catch (error) {
     console.error('Error during get best selling products:', error);
       return res.status(500).json(apiResponse({ message: 'Failed to retrieve best selling products. Please try again later.' }, 500, false));
   }
};

// @desc    Get sales trends data
// @route   GET /analytics/trends
// @access  Private (Admin)
exports.getSalesTrends = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.product');
    const monthlySales = {};

    orders.forEach(order => {
      const monthYear = order.orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlySales[monthYear]) {
        monthlySales[monthYear] = 0;
      }
      monthlySales[monthYear] += order.totalAmount;
    });

    const salesTrends = Object.entries(monthlySales).map(([monthYear, totalSales]) => ({ monthYear, totalSales }));
    return res.status(200).json(apiResponse({ salesTrends: salesTrends }, 200, true));
  }
    catch (error) {
      console.error('Error during get sales trends:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to retrieve sales trends. Please try again later.' }, 500, false));
    }
};