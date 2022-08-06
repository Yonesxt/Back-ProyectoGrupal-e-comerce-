const { Router } = require("express");
const router = Router();
const {deleteFavorite,favoritePost,getUsersFavorite} = require('../controllers/product.favorite')

router.post("/", favoritePost);

router.delete("/", deleteFavorite)

router.get("/:id", getUsersFavorite)

module.exports = router;