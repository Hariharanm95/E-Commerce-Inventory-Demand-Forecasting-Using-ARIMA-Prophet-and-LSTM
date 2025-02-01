const StockData = require('../models/stockData');
const Product = require('../models/product');
const { apiResponse } = require('../utils/apiResponse');
const aiService = require('../services/aiService');


// @desc    Get inventory report
// @route   GET /inventory/report
// @access  Private (Admin)
exports.getInventoryReport = async (req, res) => {
    try {
        const products = await Product.find({});
        const inventory = await Promise.all(products.map(async product => {
          const lastStockData = await StockData.findOne({ product: product._id}).sort({ date: -1 });
          return {
            product: product,
            stockLevel: lastStockData ? lastStockData.stockLevel: 0
          }
       }));
     return res.status(200).json(apiResponse({ inventory: inventory}, 200, true));
    } catch (error) {
       console.error('Error during getting inventory report:', error);
       return res.status(500).json(apiResponse({ message: 'Failed to retrieve inventory report. Please try again later.' }, 500, false));
    }
};

// @desc    Predict future stock levels
// @route   POST /inventory/predict
// @access  Private (Admin)
exports.predictStockLevels = async (req, res) => {
  try {
    const { dateRange } = req.body;
    const { fromDate, toDate } = dateRange;
    if (!fromDate || !toDate){
       return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
    }

     const allStockData = await StockData.find({ date: { $gte: new Date(fromDate), $lte: new Date(toDate) } }).populate('product');

    if (!allStockData || allStockData.length === 0) {
         return res.status(404).json(apiResponse({ message: 'No stock data found for the selected date range.' }, 404, false));
    }
     const predictionData = {}
    for(const stockData of allStockData){
     const product = stockData.product;
        if(!predictionData[product.name]){
           predictionData[product.name] = []
        }
        predictionData[product.name].push({
           date: stockData.date,
           stockLevel: stockData.stockLevel,
           saleCount: stockData.saleCount
        })
    }
    const predictionResult = await aiService.predictDemand(predictionData);

    if(!predictionResult){
      return res.status(500).json(apiResponse({ message: 'Failed to predict stock levels. Please try again later.' }, 500, false));
    }
    return res.status(200).json(apiResponse({ prediction: predictionResult }, 200, true));
  } catch (error) {
       console.error('Error during predict stock levels:', error);
     return res.status(500).json(apiResponse({ message: 'Failed to predict stock levels. Please try again later.' }, 500, false));
  }
};

// @desc    Recommend restocking quantities
// @route   POST /inventory/restock
// @access  Private (Admin)
exports.recommendRestock = async (req, res) => {
  try {
        const { predictionData } = req.body;
    if (!predictionData || Object.keys(predictionData).length === 0){
       return res.status(400).json(apiResponse({ message: 'Please enter all fields' }, 400, false));
    }

        const recommendation = await aiService.generateRestockRecommendation(predictionData);

        return res.status(200).json(apiResponse({ recommendation: recommendation }, 200, true));
  }
    catch (error) {
       console.error('Error during generate restock recommendation:', error);
       return res.status(500).json(apiResponse({ message: 'Failed to generate restock recommendations. Please try again later.' }, 500, false));
    }
};