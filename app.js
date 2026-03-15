if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./Utils/expressError.js");
const listingRouter=require("./Routes/listings.js");
const reviewRouter=require("./Routes/reviews.js");
const footerRouter=require("./Routes/footer.js");
const session= require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");
const userRouter=require("./Routes/users.js");

const dbUrl=process.env.ATLASDB_URL



main().then((res) => {
    console.log("Connection sucssefull");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",(err)=>{
    console.log("Error in MongoStore", err);
});

const sessionOptions={
    store: store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("Success");
    res.locals.errorMsg=req.flash("error");
    res.locals.ErrorMsg=req.flash("Error");
    res.locals.curUser=req.user;
    res.locals.mapToken=process.env.MAP_TOKEN;
    next()
});



app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);
app.use("/",footerRouter);

app.use((req, res, next) => {
    next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 400, message = "Some Eroor" } = err;
    res.status(status).render("error.ejs", { err })
});

app.listen(3000, () => {
    console.log("Listening to 3000")
});


