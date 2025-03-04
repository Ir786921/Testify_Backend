const {SaveAnalysis} = require("../models/PerformanceAnalysis");
const {generatePrompt} = require("../Utils/generatePrompt")
const saveAnalysis = async (analysisData) => {
    try {

      if (!analysisData || typeof analysisData !== "object") {
        throw new Error("Analysis data is required and must be an object.");
      }

      if (!analysisData?.testId) {
        throw new Error("testId   is required.");
      }

      const analysisObject = {
        testId: String(analysisData?.testId || ""),
        userId: String(analysisData?.userId || ""),
        userName: String(analysisData?.userName || ""),
        userEmail: String(analysisData?.userEmail || ""),
        title: String(analysisData?.title || ""),
        totalQuestions: Number(analysisData?.totalQuestions || 0),
        correctAnswers: Number(analysisData?.correctAnswers || 0),
        wrongAnswers: Number(analysisData?.wrongAnswers || 0),
        unAttempted:Number(analysisData?.unAttempted || 0),
        accuracy: String(analysisData?.accuracy || "0%"),
        averageResponseTime: String(analysisData?.averageResponseTime || "0 seconds"),
        strengths: Array.isArray(analysisData?.strengths) ? analysisData?.strengths : [],
        weaknesses: Array.isArray(analysisData?.weaknesses) ? analysisData?.weaknesses : [],
        feedback: Array.isArray(analysisData?.feedback) ? analysisData?.feedback : [],
        recommendations: Array.isArray(analysisData?.recommendations) ? analysisData?.recommendations : [],
        areasToImprove: Array.isArray(analysisData?.areasToImprove) ? analysisData?.areasToImprove : []
      };

  
   
    

      const analysis = new SaveAnalysis(analysisObject);
      
      
     
      
      await analysis.save();
      console.log('Performance analysis saved successfully.');
    } catch (error) {
      console.error('Error saving performance analysis:', error);
    }
  };

  const getAnalysis = async (req,res)=>{
    const {testId} = req.params;
    console.log(testId);
    
        try {
         const analysis = await SaveAnalysis.findOne({testId:testId});
         if(!analysis){
          console.log("No Performance analysis is found");
          
         }

         res.status(200).json({message:"Successfully Sent performance analysis",
          data:[analysis]
         })
          
        } catch (error) {
          res.status(400).json({message:"No Performance Analysis Found",
            
           })
          
        }
  }

  module.exports = {saveAnalysis,getAnalysis}