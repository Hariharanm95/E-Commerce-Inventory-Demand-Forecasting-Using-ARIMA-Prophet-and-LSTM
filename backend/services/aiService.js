const { spawn } = require('child_process');
const path = require('path');
const StockData = require('../models/stockData');
const Product = require('../models/product');
const { apiResponse } = require('../utils/apiResponse');


exports.predictDemand = async (data) => {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../ai_models/train_model.py');
        // Spawn a child process to run the python script
      const pythonProcess = spawn('python3', [scriptPath, JSON.stringify(data)]);

      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      pythonProcess.stderr.on('data', (data) => {
         console.error(`stderr: ${data.toString()}`);
        reject(`Error running ai script ${data.toString()}`);
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const parsedResult = JSON.parse(result);
             resolve(parsedResult);
           }
           catch (error) {
             console.error('Error parsing JSON response:', error);
            reject(`Error parsing json response: ${error}`);
           }
         } else {
          reject(`Process exited with code ${code}`);
         }
      });
    });
};

// Generates restock recommendations
exports.generateRestockRecommendation = async (predictionData) => {
    const recommendations = {};
    try {
       for(const [productName, prediction] of Object.entries(predictionData)){

        const product = await Product.findOne({name: productName});
        const lastStockData = await StockData.findOne({product: product._id}).sort({ date: -1 })
         const currentStock = lastStockData ? lastStockData.stockLevel : 0;
         let predictedStock = currentStock;
         let totalDemand = 0;

          for(const item of prediction){
                if(item && item.predicted_stock_level){
                    predictedStock = item.predicted_stock_level;
                }
                if(item && item.predicted_sales){
                     totalDemand += item.predicted_sales
                }
        }

          const restockQuantity = totalDemand - predictedStock;
          recommendations[productName] = restockQuantity > 0 ? Math.ceil(restockQuantity): 0;

      }
       return recommendations
    }
    catch (error) {
       console.error('Error during generating restock recommendations:', error);
       return  apiResponse({ message: 'Failed to generate restock recommendation' }, 500, false);
   }
};