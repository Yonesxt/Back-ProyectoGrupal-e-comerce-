const { Router } = require("express");
const router = Router();
const { stripe } = require ('../controllers/stripe.controllers')



router.post('/api/checkout', stripe )



module.exports = router;