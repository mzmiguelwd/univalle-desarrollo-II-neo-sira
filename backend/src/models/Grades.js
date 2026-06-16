const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: Number, required: true },
});

const SemesterSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  subjects: [SubjectSchema],
  average: { type: Number, required: true },
});

const GradesSchema = new mongoose.Schema({
  userCode: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  semesters: [SemesterSchema],
});

module.exports = mongoose.model('Grades', GradesSchema);