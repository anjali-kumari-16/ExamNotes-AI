

const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
export const generateGeminiResponse = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing in .env file");
    }
    try {
        const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        })
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        if (!text) {
            throw new Error("No text returned from Gemini");
        }
        // Robust JSON extraction to handle markdown wrappers or extra text
        let cleanText = text.trim();
        const jsonMatch = text.match(/```json?\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            cleanText = jsonMatch[1];
        } else {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleanText = text.substring(firstBrace, lastBrace + 1);
            }
        }

        return JSON.parse(cleanText.trim());


    } catch (error) {
        console.log("Gemini Fetch Error", error.message);
        throw error;
    }

}