const { Router } = require("express");
const router = Router();
const {getCategories} = require('../controllers/categories.controllers')

router.get("/", getCategories);

module.exports = router;