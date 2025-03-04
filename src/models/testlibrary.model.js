const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Field is required
  },
  desc: {
    type: String,
    required: true, // Field is required
  },
  icon: {
    type: String, // Optional field
  },
  part: {
    type: String,
    required: true, // Field is required
  },
  time: {
    type: String,
    required: true, // Field is required
  },
  level: {
    type: String,
    required: true, // Field is required
  },
  createdBy:{
    type: String,
    default:"system"
  },
  studentsAttempted: { type: Number, default: 0 },
  status: { type: String, default: 'Draft', enum: ['Draft', 'Published', 'Expired'] },
  questions: [
    {
      question: {type: String, required: true },
      options:{type:[String],required:true},
      correct_answer:{ type: String, required: true }
    }
  ]
 



});

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;
