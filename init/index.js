const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

require("dotenv").config({ path: "../.env" });

// Maptiler API setup
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

// Connect to MongoDB Atlas
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to MongoDB Atlas");

  await initDb();
}

// Initialize database
const initDb = async () => {
  // delete old listings
  await Listing.deleteMany({});
  console.log("Old listings deleted");

  const newData = await Promise.all(
    initData.data.map(async (obj) => {

      // Get coordinates from location
      const geoResponse = await maptilerClient.geocoding.forward(
        obj.location,
        { limit: 1 }
      );

      // Set owner (your Atlas user ID)
      obj.owner = new mongoose.Types.ObjectId("69b67d6dea5a7407de69347b");

      // Add geometry
      obj.geometry = geoResponse.features[0].geometry;

      return obj;
    })
  );

  await Listing.insertMany(newData);

  console.log("Database initialized with listings + geometry");
};

// Run script
main()
  .then(() => {
    console.log("Seeding completed");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });