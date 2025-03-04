const mongoose = require("mongoose");

const studentTestStatusSchema = new mongoose.Schema({
  studentName:{type:String,required:true},
  studentEmail: { type: String, required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  attemptStatus: { type: String, default: "Not Completed" }, // 'Not Completed', 'Completed'
  attemptDate: { type: Date },
  score: { type: Number }, // Track the student's score
});

const StudentTestStatus = mongoose.model("StudentTestStatus", studentTestStatusSchema);

module.exports = { StudentTestStatus } ;
