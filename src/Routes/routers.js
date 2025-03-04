const express = require("express");
const routes  = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary  = require("../Config/cloudinaryConfig");


const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'image', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png']
    }
  });
  
  // Cloudinary storage for ID images
  const idStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'id', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png']
    }
  });

  const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 5 * 1024 * 1024 } });
  const uploadID = multer({ storage: idStorage,limits: { fileSize: 5 * 1024 * 1024 }  } );


const {addUser,getUser, getDetails,LogoutUser} = require("../Controller/user.controller.js");
const {addTest, getTest} = require("../Controller/customtest.controller.js")
const {getOrganisationDashboard} = require("../Controller/dashboard.controller.js");
const {AccessLibrary,MakeChanges} = require("../Controller/library.controller.js")
const {sharedTests} = require("../Controller/sharedTest.controller.js")

const {UserResponse} = require("../Controller/userresponse.controller.js")
const {getAnalysis} = require("../Controller/Analysis.controller.js");
const {UploadImageController,UploadIdController} = require("../Controller/ImageUpload.js")

const authenticateUser  = require("../Middleware/authMiddleware.js")
routes.post("/user/Login",getUser);
routes.post("/user/Signup", addUser);
routes.post("/user/Logout",LogoutUser)
routes.post("/customtest", addTest);
routes.get("/getcustomtest/:id",getTest);
routes.get("/dashboard/:userId", getOrganisationDashboard);
routes.get("/library", AccessLibrary)
routes.post("/share",sharedTests)
routes.get("/user/details",getDetails)
routes.put("/library/:testId",MakeChanges);
routes.post("/userresponse",UserResponse)
routes.get("/getanalysis/:testId",getAnalysis)
routes.post("/upload/image/:userId",uploadImage.single("image"),  UploadImageController);
routes.post("/upload/id/:userId", uploadID.single("id"),UploadIdController);



module.exports = routes;