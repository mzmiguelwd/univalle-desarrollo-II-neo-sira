const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  usercode: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  residence_city: { type: String, required: true },
  birth_city: { type: String, required: true },
  district: { type: String, required: true },
  birth_date: { type: Date, required: true },
});

module.exports = mongoose.model("User", userSchema);
