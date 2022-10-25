const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AutoFeed = new Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  morningTime: {
    type: String,
    required: true,
  },
  morningAmount: {
    type: String,
    required: true,
  },
  afternoonTime: {
    type: String,
    required: true,
  },
  afternoonAmount: {
    type: String,
    required: true,
  },
  eveningTime: {
    type: String,
    required: true,
  },
  eveningAmount: {
    type: String,
    required: true,
  },
  extraTime: {
    type: String,
    required: true,
  },
  extraAmount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Auto Feed", AutoFeed);
