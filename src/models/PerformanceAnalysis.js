const mongoose = require('mongoose');

const performanceAnalysisSchema = new mongoose.Schema({
  testId: { type: String, required: true }, 
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  unAttempted:{type:Number,required:true},
  accuracy: { type: String, required: true },
  averageResponseTime: { type: String, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  feedback: [{ type: String }],
  recommendations: [{ type: String }],
  areasToImprove: [{ type: String }],
  
},{timestamps:true});

const SaveAnalysis= mongoose.model('SaveAnalysis', performanceAnalysisSchema);
module.exports = {SaveAnalysis}
