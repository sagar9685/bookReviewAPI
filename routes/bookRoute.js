const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");

router
  .route("/")
  .post(protect, bookController.addBook)
  .get(bookController.getBooks);

router.route("/:id").get(bookController.getBookById);

router.route("/:id/reviews").post(protect, reviewController.submitReview);

router.route("/search").get(bookController.searchBooks);

module.exports = router;
