const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestSchema = new mongoose.Schema({
  cpfKid: { type: String, required: true },
  cpfAgent: { type: String, required: true },
  weight: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
  done: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("Test", TestSchema);
