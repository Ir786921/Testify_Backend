const submitCode = async (req,res)=>{
    const { source_code, language_id } = req.body;
    const hiddenTestCases = await getHiddenTestCasesFromDB();

    const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions/batch",
        {
            submissions: hiddenTestCases.map(tc => ({
                source_code,
                language_id,
                stdin: tc.input,
            }))
        },
        {
            headers: {
                "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                "Content-Type": "application/json",
            }
        }
    );

    const tokens = response.data.map(submission => submission.token);

    // Poll for results
    const results = await Promise.all(tokens.map(async (token) => {
        let result;
        while (true) {
            const res = await axios.get(
                `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status`,
                {
                    headers: {
                        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY"
                    }
                }
            );
            result = res.data;
            if (result.status.id >= 3) break;
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        return {
            status: result.status.description,
            passed: result.status.id === 3 // Status 3 means Accepted
        };
    }));

}