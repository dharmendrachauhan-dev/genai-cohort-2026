import {GoogleGenAI} from "@google/genai"
import dotenv from "dotenv"

dotenv.config()
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


export async function askGeminiAI(question) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: question
    })

    return response.text
}
