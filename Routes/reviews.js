const express=require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync.js");
const expressError = require("../Utils/expressError.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isReviewAuthor,validateReview}=require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");


//Review post Route//
router.post("/", validateReview,isLoggedin,wrapAsync(createReview));

//Review Delete Route//
router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(deleteReview));

module.exports=router;