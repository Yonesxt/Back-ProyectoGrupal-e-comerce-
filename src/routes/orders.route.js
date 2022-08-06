const { Router } = require('express');
const router = Router();
const { getOrderById, postOrder,getAllOrder,getAllByidUser } = require('../controllers/orders.controllers.js');


router.get('/user', getAllByidUser)

router.get('/:id', getOrderById)

router.get('/', getAllOrder)

router.post('/', postOrder)

module.exports = router;