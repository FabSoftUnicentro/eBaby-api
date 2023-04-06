const mongoose = require("mongoose");

const KidSchema = new mongoose.Schema({
    cpf:{
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true
    },
    dateOfBirth:{
        type: Date,
        required: true,
    },
    gestationalAge:{
        type: Number,
        required: true,
    },
    weight:{
        type: Number,
        required: true,
    },
    length:{
        type:Number,
        required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  });

  mongoose.model("Kid", KidSchema);