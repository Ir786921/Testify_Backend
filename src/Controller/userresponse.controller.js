const Test = require("../models/CustomTest.models");
const { BaseUser } = require("../models/User.models");
const Library = require("../models/testlibrary.model");
const { StudentTestStatus } = require("../models/studentTestStatus.model")
const { generatePrompt } = require("../Utils/generatePrompt");
const { getAnalysis } = require("../Utils/analyzeWithGemini");
const { saveAnalysis } = require("../Controller/Analysis.controller");
const { ObjectId } = require("mongoose").Types;
const { getIO } = require("../socket");
const UpdateUser = async (userID) => {
  try {
    const User = await BaseUser.findById(userID).populate([
     
      "recentAssessments",
      "responseTime",
      "testsCompleted",
      "averageScore"

    ]);

    const io = getIO(); // Ensure this is returning the correct socket.io instance

    if (User) {
      console.log(
        `Emitting update with data:`,
        User
      );
      io.emit(`update`, User);
      console.log("Emitting successfull");
      // Emit the data with the correct event name
    }
  } catch (error) {
    console.error("Error notifying recruiter:", error);
  }
};

const UserResponse = async (req, res) => {
  const response = req.body;
  const testid = response?.testId;
  console.log(response);
  

  const CandidateId = response?.CandidateId
  

  try {

  if (!response) {
      throw new Error("Response not found");
    }

   const user = await BaseUser.findById(new ObjectId(CandidateId));
   if(!user){throw new Error("User Not Found")} 




  

    const dataToAnalyze = {
      testId: testid,
      title: response.title,
      userName: response.candidateName,
      userEmail: response.CandidateEmail,
      userId: response.CandidateId,
      unAttempted:response.unAttempted,
      responses: [],
    };

    if (response?.isSection) {
      const test = await Test.findOne({ _id: testid });
      if (!test) {
        console.log("test not found");

        return res.status(404).json({ error: "Test not found" });
      }

      Object.keys(response.response).forEach((sectionKey) => {
        const sectionResponses = response.response[sectionKey];

        // Check if the section has valid responses
        if (Array.isArray(sectionResponses) && sectionResponses.length > 0) {
          // Loop through each section in the test
          test.sections.forEach((testSection) => {
            // Loop through each question in the test section
            testSection.questions.forEach((question) => {
              // Find the user's response for this question
              const userResponse = sectionResponses.find(
                (res) => res.questionId === question._id.toString()
              );

              // If a response is found, push to dataToAnalyze
              if (userResponse) {
                dataToAnalyze.responses.push({
                  question: question?.question,
                  correct_answer: question?.correctAnswer,
                  selected_answer: userResponse?.answer?.answer,
                  response_time: userResponse?.answer?.responseTime,
                  time_spent: userResponse.timeSpent,
                });
              }
            });
          });
        }
      });
    } else {
      const test = await Library.findOne({ _id: testid });
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      console.log("reached here ");

      test.questions.forEach((question) => {
        const userResponse = response.response.find(
          (res) => res.questionId === question._id.toString()
        );

        dataToAnalyze.responses.push({
          question: question.question,
          correct_answer: question?.correct_answer,
          selected_answer: userResponse ? userResponse?.answer : null,
          response_time: userResponse ? userResponse?.responseTime : null,
          time_spent: userResponse ? userResponse?.timeSpent : null,
        });
      });
    }

    console.log(dataToAnalyze);

    const prompt = generatePrompt(dataToAnalyze);

  

    

    const analysis = await getAnalysis(prompt);
 

  const correct = analysis?.correctAnswers;
   const total = analysis?.totalQuestions ; 

    
    if(!response?.isSection){
 
   
  }

  if(response?.isSection){
    const getStatus = await StudentTestStatus.findOne({ test : testid })
    if(!getStatus){throw new Error("error accessing user status ")}
    const test = await Test.findById(new ObjectId(testid))
    if(!test){throw new Error("Test Not Found");}
    await getStatus.save();
  }

  else {

    const test = await Library.findById(new ObjectId(testid))
    if(!test){throw new Error("Test Not Found");}

    user.responseTime = analysis?.averageResponseTime;
    user.testsCompleted = user?.testsCompleted + 1;
    user.averageScore = (correct / total) * 100
    user.recentAssessments.push(test);
    user.unAttempted = analysis?.unAttempted
    await user.save();
    await test.save();
   
    
          
  }
 

 
  UpdateUser(new ObjectId(CandidateId))
    
    
   

    saveAnalysis(analysis);


    res.status(200).json({ message: "received" });
   
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
    console.log(error);
  }
};

module.exports = { UserResponse };
