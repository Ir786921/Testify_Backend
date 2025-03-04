const mongoose = require("mongoose");
const { trim } = require("validator");
const validator = require("validator");
const moment = require("moment")

const BaseUserSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [4, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    Email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    Password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    MobileNo: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Mobile number is required"],
      minlength: [10, "Mobile number must be at least 10 digits"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Ensure only 10 digits
        },
        message: "Please provide a valid 10-digit mobile number",
      },
    },
    isOrganisation: {
      type: Boolean,
      required: true,
      default: false, // Default is a normal user
    },

    // Normal user specific fields
    testsCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
    recentAssessments: [{
      type: mongoose.Schema.Types.ObjectId, // Array of assessment IDs or names
      ref: "Library",
    }],
    invitedBy :{
      type: mongoose.Schema.Types.ObjectId, default:null,
      ref:"OrganisationUser"
    },
    Verificationimage: { type: String ,default : null},
    VerificationId:{type: String,  default : null}
  },
  { timestamps: true }
);

const OrganisationUserSchema = new mongoose.Schema({
  OrganisationName: {
    type: String,
    maxLength: 50,
    trim: true,
  },
  testsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test", // References the Test collection
    },
  ],
  activeTests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
  ],
  sharedTests: [
    {
      test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
      sharedWith: [
        {
          studentEmail: { type: String },
          studentName: { type: String },
          testExpiry: { type: String },
          MobileNo: { type: String },
          status: { type: String, default: "Invited" },
          sharedOn: {
            type: String,
            default: () => moment().format("YYYY-MM-DD, HH:mm"),
          },
          attemptStatus: { type: String, default: "Not Completed" },
        },
      ],
    },
  ],
});

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

// Add discriminator for organization-specific users
const OrganisationUser = BaseUser.discriminator(
  "OrganisationUser",
  OrganisationUserSchema
);

module.exports = {
  BaseUser,
  OrganisationUser,
};
