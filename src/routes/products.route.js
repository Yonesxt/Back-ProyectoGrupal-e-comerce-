const { Router } = require("express");
const router = Router();
const {getProducts, postProduct,getFilter,updateProduct, updateStock, getAllBrand} = require('../controllers/products.controllers')


router.get('/', getProducts)

router.post('/filter', getFilter)

// router.get('/brand', getProductsByBrand)

router.get('/brand/all', getAllBrand)

// router.get('/categories', filterByCategories)

// router.get('/orderByName', getOrderByName)

router.post('/', postProduct)

router.put('/', updateProduct)

router.put('/stock', updateStock)

module.exports = router;