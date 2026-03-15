const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAP_TOKEN;


module.exports.index = async (req, res) => {
let { category, location } = req.query;
let filter = {};

if(category){
filter.category = category;
}

if(location){
filter.location = { $regex: location, $options: "i" };
}
let Listings = await Listing.find(filter);
res.render("home.ejs", { Listings });
};

module.exports.rendernewform= (req, res) => {
    res.render("new.ejs");
};

module.exports.newPost = async (req, res) => {

    let response = await maptilerClient.geocoding.forward(
        req.body.Listing.location,
        { limit: 1 }
    );

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.Listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.features[0].geometry;

    await newListing.save();

    req.flash("Success", "New Listing has been Created");
    res.redirect("/listings");
};

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("Error", "Listing You have requested does not exist anymore!")
        return res.redirect("/listings")
    }

    let originalurl=list.image.url;
    originalurl = originalurl.replace("/upload", "/upload/w_250,h_100,c_fill");
    res.render("edit.ejs", { list, originalurl})
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Re-geocode the new location
    let response = await maptilerClient.geocoding.forward(
        req.body.Listing.location,
        { limit: 1 }
    );

    let newGeometry = response.features[0].geometry;

    // Include geometry directly in the update object
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.Listing, geometry: newGeometry },
        { runValidators: true, new: true }
    );

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("Success", "Listing has been Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
    .populate({
        path:"reviews",
    populate:{
        path:"author"}
    })
    .populate("owner");
    if(!list){
        req.flash("Error", "Listing You have requested does not exist anymore!")
        return res.redirect("/listings")
    }
    res.render("show.ejs", { list })
}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Lsiting has been Deleted")
    res.redirect("/listings")
}

