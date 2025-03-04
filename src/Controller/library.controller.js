const mongoose = require('mongoose');
const library = require("../models/testlibrary.model");
const data = require("../assest/data.json")

const AccessLibrary = async (req,res)=>{
  const {testId} = req.params
    try {
        const libraries = await library.find(); // Fetch all documents from the Library collection
        res.status(200).json(libraries); // Send the data as JSON
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error });
      }
     
}

const MakeChanges = async(req,res)=>{

  try {
   
    console.log(testId);
     // Extract test ID from URL
    const questions  = req.body; // Extract questions array from request body

    // Ensure questions is an array
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid format: questions must be an array." });
    }

    // Update the document
    const updatedTest = await library.findByIdAndUpdate(
      testId,
      { questions: questions },  // Directly assign the array of objects
      { new: true }  // Returns the updated document
    )
 console.log(updatedTest);
 
    if (!updatedTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.status(200).json(updatedTest);
  } catch (error) {
    console.log(error);
    console.log(error);
    
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports =  { AccessLibrary,MakeChanges }