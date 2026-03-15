const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: String,
  },
  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
  },
  country: {
    type: String,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number]
  }
},
category: {
    type: String,
    enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic"
    ],
    default: "Trending"
}
});

listingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing) {
    await Review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
