const { OrganisationUser } = require("../models/User.models");
const Test = require("../models/CustomTest.models");
const StudentTestStatus = require("../models/studentTestStatus.model");
const { BaseUser } = require("../models/User.models");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const { getIO } = require('../socket');
const notifyRecruiterUpdate = async (recruiterId) => {
  try {
    const recruiter = await BaseUser.findById(recruiterId).populate([
      "testsCreated",
      "activeTests",
      "sharedTests"
    ]);

    const io = getIO(); // Ensure this is returning the correct socket.io instance

    if (recruiter) {
      console.log(`Emitting updateRecruiter-${recruiterId} with data:`, recruiter);
      io.emit(`update`, recruiter); // Emit the data with the correct event name
    }
  } catch (error) {
    console.error("Error notifying recruiter:", error);
  }
};



const generateRandomPassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sharedTests = async (req, res) => {
  const { candidateEmail, testExpiry, MobileNo, testId, candidateName } = req.body;
  console.log(req.body);

  console.log(`http://localhost:5000/details/${testId}`);
  
  

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const recruiter = await OrganisationUser.findById(test.createdBy);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Set the expiry date for the test
    const expiryDateObj = new Date(testExpiry);

    // Check if expiry date is in the future
    if (expiryDateObj <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in the future" });
    }

    // Create or fetch the student
    let student = await BaseUser.findOne({ StudentEmail: candidateEmail });
    if (!student) {
      const password = generateRandomPassword(); // Generate random password
      const hashedpwd = await bcrypt.hash(password,10)
      student = new BaseUser({
        FullName: candidateName,
        Email: candidateEmail,
        Password: hashedpwd,
        MobileNo: MobileNo,
        invitedBy:recruiter
      });

      // Now, attempt to send the email
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service
        auth: {
          user: "testify191@gmail.com", // Your email
          pass: "sfyn wrsa kmnc ctos", // Your email password or app-specific password
        },
      });

      const mailOptions = {
        from: "imranraza2016a@gmail.com", // Your email
        to: candidateEmail,
        subject: "Your Login Credentials",
        text:`Amazon - Online Test Invitation
Dear ${candidateName},

You have been invited to attend a test for {{Org_Name}}.

Test Instructions:
Take the test within {{target_time}} hours after receiving this email.
It is an online proctored test.
For proctoring purposes, your video, audio & browser session will be recorded and analyzed.
Take the test from a quiet location with low background noise. Avoid taking the test in breakouts, cafeterias, or public places.

System Requirements to Attend the Test:
Browser: Any latest browser version, for example: Google Chrome version 127 or above, with cookies & popups enabled.
Machine: Only use a laptop/desktop. DO NOT use a mobile device.
Video/Audio: Webcam and a good quality/USB Mic is required.
Operating System: Windows 8 or 10 or 11, Mac OS X 10.9 Mavericks or Higher.
RAM & Processor: Minimum 8GB RAM, 5th Generation 2.2 GHz or equivalent/higher.
Internet Connection: Stable 2 Mbps or more. Try using Broadband.

Your login credentials for the platform are as follows:

Test URL:http://localhost:5000/SignUp?mode=login&testid=${testId}
Email: ${candidateEmail}
Password: ${password}

Please use these credentials to log in and take the test.

Good luck!

Best regards,  
Testify`
      };

      // Send the email and handle success or failure
      const emailInfo = await transporter.sendMail(mailOptions);
      if (!emailInfo || emailInfo.rejected.length > 0) {
        // If email fails
        return res.status(500).json({ message: "Error sending email. No data was created." });
      }

      // Save the new student if email is sent successfully
      await student.save();
    }

    // Update recruiter and test with shared test data
    recruiter.sharedTests.push({
      test: testId,
      sharedWith: [
        {
          studentName:candidateName,
          studentEmail: candidateEmail,
          testExpiry: expiryDateObj,
          MobileNo:MobileNo
        },
      ],
    });

    // Create the student test status entry only if email was sent successfully
    await StudentTestStatus.create({
      studentName:candidateName,
      studentEmail: candidateEmail,
      test: testId,
    });

    // Save recruiter and test changes
    await recruiter.save();
    await test.save();

    notifyRecruiterUpdate(recruiter._id);

    res.status(200).json({ message: "Test shared successfully" });
  } catch (error) {
    console.error("Error in sharing test:", error);
    res.status(500).json({ message: "Error sharing the test" });
  }
};

module.exports = { sharedTests };

