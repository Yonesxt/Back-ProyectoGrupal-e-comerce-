const { Router } = require("express");
const router = Router();
const {createAndAddComment,getCommentsbyProduct,editComment,deleteCommentById,GetAllReviews} = require('../controllers/product.reviews')

router.post("/", createAndAddComment);

router.get("/", getCommentsbyProduct);

router.get("/all", GetAllReviews);

router.put("/", editComment)

router.delete("/", deleteCommentById)

module.exports = router;