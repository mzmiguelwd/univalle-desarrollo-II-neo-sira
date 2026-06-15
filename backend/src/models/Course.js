const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    initialHour: { type: String, required: true },
    finalHour: { type: String, required: true },
    academicBuilding: { type: String, required: true },
    classroom: { type: String, required: true },
  },
  { _id: false },
);

const courseSchema = new mongoose.Schema({
  usercode: { type: String, required: true, ref: "User" },
  code: { type: String, required: true },
  group: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  credits: { type: Number, required: true },
  schedule: [scheduleSchema],
});

module.exports = mongoose.model("Course", courseSchema);
