const Test = require("../models/CustomTest.models");
const { BaseUser } = require("../models/User.models");
const Library = require("../models/testlibrary.model");
const jwt = require("jsonwebtoken");
const { getIO } = require("../socket");
const notifyRecruiterUpdate = async (recruiterId) => {
  try {
    const recruiter = await BaseUser.findById(recruiterId).populate([
      "testsCreated",
      "activeTests",
      "sharedTests",
    ]);

    const io = getIO(); // Ensure this is returning the correct socket.io instance

    if (recruiter) {
      console.log(
        `Emitting updateRecruiter-${recruiterId} with data:`,
        recruiter
      );
      io.emit(`update`, recruiter);
      console.log("Emitting successfull");
      // Emit the data with the correct event name
    }
  } catch (error) {
    console.error("Error notifying recruiter:", error);
  }
};

const getTest = async (req, res) => {
  const recruiterId = req.params.id;
  console.log(recruiterId);

  try {
    const tests = await Test.find({  $or: [
      { createdBy: recruiterId },
      { _id: recruiterId }
  ] });
    res.status(201).json({
      message: "Tests Fetched",
      test: tests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addTest = async (req, res) => {
  const userQuestion = req.body;
  console.log(userQuestion);
  

  console.log(userQuestion.sections);

  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    console.log(userId);

    const test = new Test(userQuestion);
    test.createdBy = userId;

    if (!test.name || !test.desc || !test.duration || !test.sections) {
      return res.status(400).json({ message: "Invalid test data" });
    }

    const user = await BaseUser.findById(userId).populate("testsCreated");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isOrganisation) {
      return res
        .status(403)
        .json({ message: "Only organizations can create tests" });
    }

    await test.save();

    

    user.testsCreated.push(test);
    await user.save();

    notifyRecruiterUpdate(userId);

    res.status(201).json({
      message: "Test created successfully",
      test: test,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addTest,
  getTest,
};
