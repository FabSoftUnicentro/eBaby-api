const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestQuestionSchema = new mongoose.Schema({
  test_id: {
    type: Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  question_id: {
    type: Number,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("TestQuestion", TestQuestionSchema);
