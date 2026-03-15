const express = require("express")
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const expressError = require("../Utils/expressError.js");

router.get("/privacy",(req,res)=>{
res.render("privacy.ejs");
});

router.get("/terms",(req,res)=>{
res.render("terms.ejs");
});

router.get("/sitemap",(req,res)=>{
res.render("sitemap.ejs");
});

module.exports=router;