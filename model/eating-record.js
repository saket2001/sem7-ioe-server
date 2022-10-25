const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EatingRecords = new Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amountGiven: {
    type: String,
    required: true,
  },
  date: {
    type: 'String',
    required: true,
  },
  time: {
    type: 'String',
    required: true,
  },
  type_of_action: {
    type: String,
    required: true,
  },
  food_brand: {
    type: String,
    required: true,
  },
  food_type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Eating-Records", EatingRecords);
