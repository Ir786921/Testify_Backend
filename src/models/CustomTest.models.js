const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    
    question: { type: String, required: true },
    options: { type: [String], default: [] }, // Only for MCQs
    correctAnswer: { type: String }, // Only for MCQs
    description: { type: String },
    testCases:{ type: [{
      input: { type: String, required: true },
      output: { type: String, required: true }
    }], default: [] } 
    
  });

  const sectionSchema = new mongoose.Schema({
   
    name: { type: String, required: true },
    questionType: { type: String, enum: ["MCQ", "Programming"], required: true },
    questions: { type: [questionSchema], default: [] },
  });


  const testSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      desc: { type: String },
      duration: { type: Number, required: true },
      level:{type:String, required:true},
      icon:{type:String ,default : "Q"},
      sections: { type: [sectionSchema], default: [] },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'BaseUser' }, // Reference to recruiter/organization
      testExpiry: { type: Date }, // Expiry date for the test link
      studentsAttempted: { type: Number, default: 0 }, // Number of students who have attempted the test
      status: { type: String, default: 'Draft', enum: ['Draft', 'Published', 'Expired'] }, // Track status of the test
    },
    { timestamps: true }
  );
  
  const Test = mongoose.model("Test", testSchema);
  
  module.exports = Test;