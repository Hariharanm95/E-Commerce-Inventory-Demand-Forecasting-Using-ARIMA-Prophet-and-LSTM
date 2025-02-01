const Product = require('../models/product');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Get all products
// @route   GET /products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, priceMin, priceMax, sortBy, sortOrder } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (priceMin) filter.price = { $gte: parseFloat(priceMin) };
    if (priceMax) filter.price = { ...filter.price, $lte: parseFloat(priceMax) };

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    const products = await Product.find(filter).sort(sort);
     return res.status(200).json(apiResponse({ products: products}, 200, true));
  } catch (error) {
       console.error('Error during get all products:', error);
    return res.status(500).json(apiResponse({ message: 'Failed to retrieve products. Please try again later.' }, 500, false));
  }
};

// @desc    Get a specific product by ID
// @route   GET /products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json(apiResponse({ message: 'Product not found.' }, 404, false));
        }
        return res.status(200).json(apiResponse({ product: product }, 200, true));
    } catch (error) {
         console.error('Error during get product by id:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to retrieve product. Please try again later.' }, 500, false));
    }
};


// @desc    Add a new product
// @route   POST /products
// @access  Private (Admin)
exports.addProduct = async (req, res) => {
    try {
        const { name, description, category, price, imageUrl, stock } = req.body;

        if (!name || !description || !category || !price || !imageUrl || !stock) {
           return res.status(400).json(apiResponse({ message: 'Please fill all fields' }, 400, false));
        }
        const newProduct = new Product({
            name,
            description,
            category,
            price,
            imageUrl,
            stock
        });

        const savedProduct = await newProduct.save();

         return res.status(201).json(apiResponse({ message: 'Product added successfully', product: savedProduct }, 201, true));
    }
    catch (error) {
          console.error('Error during product add:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to add product. Please try again later.' }, 500, false));
    }
};

// @desc    Update a product by ID
// @route   PUT /products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, category, price, imageUrl, stock } = req.body;

        if (!name || !description || !category || !price || !imageUrl || !stock) {
            return res.status(400).json(apiResponse({ message: 'Please fill all fields' }, 400, false));
         }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
          {
            name,
            description,
            category,
            price,
            imageUrl,
            stock
         }, { new: true, runValidators: true });


         if (!updatedProduct) {
              return res.status(404).json(apiResponse({ message: 'Product not found.' }, 404, false));
         }


          return res.status(200).json(apiResponse({ message: 'Product updated successfully', product: updatedProduct}, 200, true));
    }
    catch (error) {
         console.error('Error during product update:', error);
        return res.status(500).json(apiResponse({ message: 'Failed to update product. Please try again later.' }, 500, false));
    }
};

// @desc    Delete a product by ID
// @route   DELETE /products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json(apiResponse({ message: 'Product not found.' }, 404, false));
        }
        return res.status(200).json(apiResponse({ message: 'Product deleted successfully'}, 200, true));
    }
    catch (error) {
       console.error('Error during product delete:', error);
         return res.status(500).json(apiResponse({ message: 'Failed to delete product. Please try again later.' }, 500, false));
    }
};