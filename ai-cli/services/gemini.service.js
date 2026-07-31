import dotenv from "dotenv"
import {GoogleGenAI} from "@google/genai"

dotenv.config()
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


export async function askGeminiAI(question) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: question
    })

    return response.text
}
