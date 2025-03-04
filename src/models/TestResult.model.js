const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  candidateEmail: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // In seconds
    required: true
  },
  sectionPerformance: [
    {
      section: String,
      score: Number,
      total: Number
    }
  ],
  aiInsights: {
    strengths: [String],
    weaknesses: [String],
    improvementSuggestions: [String]
  },
  proctoringData: {
    warnings: {
      type: Number,
      default: 0
    },
    faceDetection: [
      {
        timestamp: { type: Date, default: Date.now },
        status: String // "Face Not Detected", "Multiple Faces Detected"
      }
    ],
    audioDetection: [
      {
        timestamp: { type: Date, default: Date.now },
        detected: String // "Multiple Voices", "Suspicious Noise"
      }
    ]
  },
  attemptStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);
