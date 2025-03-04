const generatePrompt = (userData) => {
    // Extract user data dynamically
    const totalQuestions = userData?.responses.length;
    const correctAnswers = userData?.responses.filter(response => response.selected_answer === response.correct_answer).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const accuracy = parseInt( (correctAnswers / totalQuestions) * 100);
    const averageResponseTime = userData?.responses.reduce((sum, response) => 
      sum + parseFloat(response.response_time), 0
    ) / totalQuestions;

   
    
    
  
    // Strengths and weaknesses calculation

  
    // Constructing the prompt dynamically
const prompt = `Analyze the performance of ${userData?.userName} based on their responses to the following questions: \n\n
  - Title: ${userData?.title} \n
  - TestId : ${userData?.testId} \n
  - User Name: ${userData?.userName} \n
  - User Email: ${userData?.userEmail} \n
  - User ID: ${userData?.userId} \n
  - Total Number of Questions: ${totalQuestions} \n
  - Correct Answers: ${correctAnswers} \n
  - Wrong Answers: ${wrongAnswers} \n
  - unAttempted:${userData?.unAttempted}
  - Accuracy: ${accuracy}% \n
  - Average Response Time: ${Number(averageResponseTime.toFixed(2))} \n\n
  Provide a detailed analysis including the following: \n
  - Strengths: Highlight at least three positive aspects even if accuracy is low. Focus on engagement, consistency, speed, or effort if needed. \n
  - Weaknesses: Identify areas of improvement based on incorrect answers, accuracy, and response time. Frame these as growth opportunities. \n
  - Feedback: Offer constructive feedback that acknowledges effort and provides encouragement. \n
  - Recommendations: Give actionable steps for improvement, such as study strategies, practice methods, or resource suggestions. \n
  - Areas to Improve: Specify key areas requiring attention, ensuring they are actionable and realistic. \n\n
  Return the result in JSON format with the following structure: \n
  {
    \"testId\": \"${userData?.testId}\",
    \"userId\": \"${userData?.userId}\",
    \"userName\": \"${userData?.userName}\",
    \"userEmail\": \"${userData?.userEmail}\",
    \"title\": \"${userData?.title}\",
    \"totalQuestions\": ${totalQuestions},
    \"correctAnswers\": ${correctAnswers},
    \"wrongAnswers\": ${wrongAnswers},
    \"unAttempted\":${userData?.unAttempted}
    \"accuracy\": \"${accuracy}%\",
    \"averageResponseTime\": \"${Number(averageResponseTime.toFixed(2))}\",
    \"strengths\": [\"...\", \"...\", \"...\"],
    \"weaknesses\": [\"...\", \"...\", \"...\"],
    \"feedback\": [\"...\", \"...\", \"...\"],
    \"recommendations\": [\"...\", \"...\", \"...\"],
    \"areasToImprove\": [\"...\", \"...\", \"...\"]
  }
  Ensure the lists under strengths, weaknesses, feedback, recommendations, and areas to improve contain a maximum of 6 points each, with at least three strengths highlighted, regardless of accuracy.`;


  
  
    return prompt;
  };

  module.exports = {generatePrompt}
  