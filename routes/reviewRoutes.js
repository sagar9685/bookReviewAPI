const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const reviewController = require("../controllers/reviewController");

router
  .route("/:id")
  .put(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

module.exports = router;
