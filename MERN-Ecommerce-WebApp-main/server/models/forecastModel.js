const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
    ds: { type: String, required: true }, // 'YYYY-MM'
    topProduct: { type: String, required: true },
    y: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Forecast", forecastSchema);
