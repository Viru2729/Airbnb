const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const expressError = require("../Utils/expressError.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const { index, rendernewform, newPost, editListing, updateListing, showListing, deleteListing } = require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


//index Route//
router.get("/", wrapAsync(index));

//New & Create Route//
router.get("/new", isLoggedin,rendernewform);

router.post("/post",
    isLoggedin, 
    validateListing,
    upload.single("Listing[image][url]"),
    wrapAsync(newPost));

//edit
router.get("/:id/edit", isLoggedin, isOwner,wrapAsync(editListing));

//update//
router.patch("/:id",
    isLoggedin,
    isOwner,
    validateListing, 
    upload.single("Listing[image][url]"),
    wrapAsync(updateListing));

//Show route//
router.get("/:id", 
    wrapAsync(showListing));


//delete//
router.delete("/:id/delete", 
    isLoggedin, 
    isOwner, 
    wrapAsync(deleteListing));


module.exports = router;