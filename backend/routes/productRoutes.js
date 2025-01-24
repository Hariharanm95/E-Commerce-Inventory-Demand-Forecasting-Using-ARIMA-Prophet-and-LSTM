const express = require('express')
const router = express.Router()

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllers.js')

router.post('/', createProduct)

router.get('/', getProducts)

router.get('/:id', getProduct)

router.put('/:id', updateProduct)

router.delete('/:id', deleteProduct)

module.exports = router;