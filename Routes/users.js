const express = require("express");
const router = express.Router();
const passport=require("passport");
const { saveUrl } = require("../middleware.js");
const { signUp, rendersignUp, renderlogIn, logOut, logIn } = require("../controllers/users.js");

router.route("/signup")
.get(rendersignUp)
.post( signUp);

router.route("/login")
.get(renderlogIn)
.post(saveUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), logIn);

router.get("/logout",logOut);

module.exports=router;
