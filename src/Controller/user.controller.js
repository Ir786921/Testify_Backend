const { BaseUser, OrganisationUser }= require("../models/User.models.js");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const getDetails = async (req,res)=>{
  const {token} = req.cookies;
  
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing! Login First" });
  }
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const user = await BaseUser.findById(userId).populate(["testsCreated", "recentAssessments","Verificationimage","VerificationId"]);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message:"user details fetch",
      user:user
    })
    
  } catch (error) {
    res.status(400).json({
      message:`Error fetching user : ${error?.message}`,
      
    })
  }

 
}

const getUser = async (req, res) => {
  const {Email,Password} = req.body
  

  try {
    const user = await BaseUser.findOne({ Email: Email });
    if (!user) {
      throw new Error("Invalid Credentials")
    }

    const IsPasswordValid = await bcrypt.compare(Password,user.Password);

    if(IsPasswordValid){
      const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
      
      
      res.cookie("token",token)
      const { Password, ...userData } = user.toObject();
      res.status(200).json({
        message: "Login successful.",
        user: true
      });
    }

    else{
      throw new Error("Invalid Credentials")
    }
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const { FullName, Email, Password, OrganisationName, MobileNo,isOrganisation } = req.body;

  console.log(req.body);

  try {
    const existingUser = await BaseUser.findOne({
      $or: [{ Email: Email }, { MobileNo: MobileNo }],
    });

    if (existingUser) {
      if (existingUser.Email === Email) {
        return res.status(400).json({
          message: "User with this email already exists. Please login.",
          code: 400,
        });
      }
      if (existingUser.MobileNo === MobileNo) {
        return res.status(400).json({
          message: "User with this mobile number already exists.",
          code: 400,
        });
      }
    }

    if (!validator.isEmail(Email)) {
      throw new Error("Invalid Email");
    }

    if (!validator.isStrongPassword(Password, { minLength: 8 })) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols."
      );
    }
    if (!validator.isMobilePhone(MobileNo)) {
      throw new Error("Mobile Number Should be 10 digit");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    let user;
    if (isOrganisation) {
      // Create an organization user
      user = new OrganisationUser({
        FullName,
        Email,
        Password: hashedPassword,
        MobileNo,
        isOrganisation: true,
        OrganisationName, // Organization-specific field
        testsCreated: [], // Default empty array for organizations
        activeTests: [], // Default empty array for organizations
      });
    } else {
      // Create a normal user
      user = new BaseUser({
        FullName,
        Email,
        Password: hashedPassword,
        MobileNo,
        isOrganisation: false,
        testsCompleted: 0, // Default value for normal user
        averageScore: 0, // Default value for normal user
        responseTime: 0, // Default value for normal user
        recentAssessments: [], // Default empty array for normal user
      });
    }

    // Save the user
    await user.save();

    // Return response based on user type
    if (user.isOrganisation) {
      // Response for Organization User
      res.status(201).json({
        message: "Organization successfully registered.",
        code: 201,
        user: {
          id: user._id,
          FullName: user.FullName,
          Email: user.Email,
          OrganisationName: user.OrganisationName,
          MobileNo: user.MobileNo,
          isOrganisation: user.isOrganisation,
          testsCreated: user.testsCreated,
          activeTests: user.activeTests,
        },
      });
    } else {
      // Response for Normal User
      res.status(201).json({
        message: "Normal user successfully registered.",
        code: 201,
        user: {
          id: user._id,
          FullName: user.FullName,
          Email: user.Email,
          MobileNo: user.MobileNo,
          isOrganisation: user.isOrganisation,
          testsCompleted: user.testsCompleted,
          averageScore: user.averageScore,
          responseTime: user.responseTime,
          recentAssessments: user.recentAssessments,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      code: 400,
    });
  }
};


const LogoutUser = async (req,res)=>{
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

module.exports = { addUser, getUser ,getDetails,LogoutUser };
