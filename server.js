const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
//////////////////////////////////
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//////////////////////////////////

const dbConnect = () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected successFully`);
  } catch (error) {
    console.log(error.message);
  }
};

dbConnect();

//////////////////////////////////
server.get("/api/v1/check-server", routes.checkServer);

// pets related
server.get("/api/v1/pet-distance", routes.getDistance);
server.get("/api/v1/check-motion", routes.checkForMotion);
server.post("/api/v1/feed-pet", routes.feedPet);
server.put("/api/v1/manage-auto-feed", routes.manageAutoFeed);
server.get(
  "/api/v1/get-feeding-details/:owner_id",
  routes.getFeedingDetailsById
);
server.get(
  "/api/v1/get-feeding-details-by-date/:owner_id/:date",
  routes.getFeedingDetailsByDate
);
// server.get(
//   "/api/v1/get-todays-feeding-details/:owner_id",
//   routes.getTodaysFeedingDetailsById
// );
server.get("/api/v1/get-auto-feed/:owner_id", routes.getAutoFeedRecord);

// owner related
server.get("/api/v1/get-details/:owner_id", routes.getDetailsById);
server.get("/api/v1/delete-owner/:owner_id", routes.deleteOwner);

// auth
server.post("/api/v1/owner-sign-in", routes.ownerSignIn);
server.post("/api/v1/owner-sign-up", routes.createOwner);

// analysis
server.get("/api/v1/pet-analysis/:owner_id/:date", routes.dataAnalysis);
//////////////////////////////////

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
