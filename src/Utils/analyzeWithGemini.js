require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {generatePrompt} = require("../Utils/generatePrompt")

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 // Use gemini-1.5-flash as planned

const getAnalysis = async (prompt) => {
  
    const result = await model.generateContent(prompt);
   
    let text =   result.response.text();
    text = text.trim();  
    text = text.replace(/^```json/, "").replace(/```$/, "");
    return JSON.parse(text);
    
 
};

module.exports = {getAnalysis}
  