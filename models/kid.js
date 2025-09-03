const mongoose = require("mongoose");

const moment = require('moment');

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
    sex: {
      type: String,
      required: false,
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

  KidSchema.methods = {
    getAge() {
      const birthDate = moment(this.dateOfBirth);
      const today = moment();
      
      return today.diff(birthDate, 'years');
    },

    getGestationalAge() {
      return this.gestationalAge
    }
  };

  mongoose.model("Kid", KidSchema);