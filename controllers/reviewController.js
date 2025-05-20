const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Review = require("../models/Review");

// @desc    Submit a review for a book
// @route   POST /api/books/:id/reviews
// @access  Private
const submitReview = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const { rating, comment } = req.body;

  const review = await Review.create({
    book: book._id,
    user: req.user,
    rating,
    comment,
  });

  res.status(201).json(review);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if the review belongs to the user
  if (review.user.toString() !== req.user.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this review");
  }

  const { rating, comment } = req.body;

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  const updatedReview = await review.save();
  res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if the review belongs to the user
  if (review.user.toString() !== req.user.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this review");
  }

  await review.remove();
  res.json({ message: "Review removed" });
});

module.exports = {
  submitReview,
  updateReview,
  deleteReview,
};
