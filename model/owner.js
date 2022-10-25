const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Owner = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pet_name: {
    type: String,
    required: true,
  },
  pet_age: {
    type: String,
    required: true,
  },
  pet_breed: {
    type: String,
    required: true,
  },
  pet_category: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model("Owner",Owner)