import {GoogleGenAI} from '@google/genai';
import dotenv from "dotenv"

dotenv.config()
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: 'hi my name is dharmendra chauhan',
  });
  console.log(response.text);
}

main();