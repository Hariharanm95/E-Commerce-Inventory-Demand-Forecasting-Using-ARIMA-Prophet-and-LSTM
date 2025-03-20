const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
    topProducts: [{ month: String, top_product: String, predicted_sales: Number }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Forecast", forecastSchema);
