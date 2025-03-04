const SubmissionModel = require("../models/SubmissionSchema")
const axios = require("axios");

const runCode = async (req, res) => {
    try {
        const { language, code, input } = req.body;
        console.log("Request Body:", req.body);

        // ✅ Judge0 Language ID Mapping
        const languageMap = {
            "JavaScript": 63,
            "Python": 71,
            "C++": 52,
            "Java": 62
        };

        const language_id = languageMap[language];

        if (!language_id) {
            return res.status(400).json({ error: "Unsupported language" });
        }

        // ✅ RapidAPI Headers
        const headers = {
            "X-RapidAPI-Key": "685fb5a70fmsh2c2d8411e3c1840p188725jsn0e10478e8bd4",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        };

        // ✅ Run Code (Execute Without Polling)
        const response = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?wait=true", // `wait=true` makes it synchronous
            { language_id, source_code: code, stdin: input },
            { headers }
        );

        // ✅ Send Output
        res.json({
            output: response.data.stdout || response.data.stderr
        });

    } catch (error) {
        console.error("Execution Error:", error.response ? error.response.data : error);
        res.status(500).json({ error: "Failed to execute code" });
    }
};


const submitCode = async (req,res)=>{
    try {
        const { userId, questionId, language, code } = req.body;
        
        // Store submission in the database (pseudo-code, replace with actual model)
        const submission = new SubmissionModel({ userId, questionId, language, code });
        await submission.save();
        
        res.json({ message: "Code submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit code" });
    }
}



module.exports = {runCode,submitCode}

