const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

require("dotenv").config({ path: "../.env" });
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  console.log("connected To DB");

  await initDb();
}

const initDb = async () => {
  await Listing.deleteMany({});

  const newData = await Promise.all(
    initData.data.map(async (obj) => {

      const geoResponse = await maptilerClient.geocoding.forward(
        obj.location,
        { limit: 1 }
      );

      obj.owner = "69a2cf9b8162135de056ba55";

      obj.geometry = geoResponse.features[0].geometry;

      return obj;
    })
  );

  await Listing.insertMany(newData);

  console.log("data Initialized with geometry");
};

main().catch((err) => console.log(err));