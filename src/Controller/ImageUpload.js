const { BaseUser} = require("../models/User.models")
const { getIO } = require('../socket');
const notifyRecruiterUpdate = async (recruiterId) => {
  try {
    const recruiter = await BaseUser.findById(recruiterId).populate([
      "testsCreated",
      "activeTests",
      "sharedTests",
      "Verificationimage",
      "VerificationId"


    ]);

    const io = getIO(); // Ensure this is returning the correct socket.io instance

    if (recruiter) {
      console.log(`Emitting updateRecruiter-${recruiterId} with data:`, recruiter);
      io.emit("update", recruiter); // Emit the data with the correct event name
    }
  } catch (error) {
    console.error("Error notifying recruiter:", error);
  }
};

const UploadImageController = async (req, res) => {

   
    const data = req.file
    console.log(data);
    const {userId} = req.params;
    console.log(userId);
    

   
    
   
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
       const user = await BaseUser.findById(userId);
       if(!user){
        return res.status(400).json({ error: "User Not Found" });
       }

       user.Verificationimage = req.file.path;
       await user.save({ validateBeforeSave: false });
       notifyRecruiterUpdate(userId)
       res.json({ imageUrl: req.file.path }); 
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
};

const UploadIdController = async (req, res) => {

    console.log(req.body);
    
   
    const data = req.file
    console.log(data);
    const {userId} = req.params
    console.log(userId);
    
    
   
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const user = await BaseUser.findById(userId);
       if(!user){
        return res.status(400).json({ error: "User Not Found" });
       }

       user.VerificationId = req.file.path;
       await user.save({ validateBeforeSave: false });
       notifyRecruiterUpdate(userId)
        res.json({ imageUrl: req.file.path }); 
    } catch (error) {
        console.error("ID upload error:", error);
        res.status(500).json({ error: "ID upload failed" });
    }
};


module.exports = { UploadImageController,UploadIdController };
