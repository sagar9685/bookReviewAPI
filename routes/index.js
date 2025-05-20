const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoute");
const bookRoutes = require("./bookRoute");
const reviewRoutes = require("./reviewRoutes");

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
