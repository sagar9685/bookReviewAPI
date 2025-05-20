const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Review = require("../models/Review");

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  const book = await Book.create({
    title,
    author,
    genre,
    publishedYear,
    createdBy: req.user,
  });

  res.status(201).json(book);
});

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { author, genre } = req.query;

  const query = {};
  if (author) query.author = author;
  if (genre) query.genre = genre;

  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
  };

  const books = await Book.paginate(query, options);
  res.json(books);
});

// @desc    Get book details by ID with average rating and reviews
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Calculate average rating
  const reviewsAggregate = await Review.aggregate([
    { $match: { book: book._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = reviewsAggregate[0]?.averageRating || 0;
  const reviewCount = reviewsAggregate[0]?.reviewCount || 0;

  // Get reviews with pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ book: book._id })
    .populate("user", "name")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    ...book.toObject(),
    averageRating: averageRating.toFixed(1),
    reviewCount,
    reviews,
  });
});

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  const books = await Book.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  res.json(books);
});

module.exports = {
  addBook,
  getBooks,
  getBookById,
  searchBooks,
};
