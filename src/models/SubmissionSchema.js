const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
code: {type:String},
  language:{type:String},
  testCases: {type:[String]},
  results: {type:[String]},
  submittedAt: { type: Date, default: Date.now },
})

const Submission = mongoose.model("Submission",SubmissionSchema);
module.exports = {Submission}