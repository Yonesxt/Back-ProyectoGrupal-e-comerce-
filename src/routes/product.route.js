const { Router } = require("express");
const router = Router();
const {getProductDetail, deleteProduct} = require('../controllers/product.controllers')

router.get('/:id', getProductDetail)

router.put('/:id', deleteProduct)

module.exports = router;