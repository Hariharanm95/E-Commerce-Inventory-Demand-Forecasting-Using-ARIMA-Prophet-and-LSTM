const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockDataSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  stockLevel: {
    type: Number,
    required: true,
     min: 0
  },
    saleCount: {
      type: Number,
     min:0
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

stockDataSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const StockData = mongoose.model('StockData', stockDataSchema);

module.exports = StockData;