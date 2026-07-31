import { askGeminiAI } from "../services/gemini.service.js";
import { askOpenAI } from "../services/openai.service.js";
import { judge } from "../services/judge.service.js";


async function router(question) {
    const [openai, gemini] = await Promise.all([
        askOpenAI(question),
        askGeminiAI(question)
    ])

    console.log(openai)
    const best = await judge({
        question,
        openai,
        gemini
    })

    return best
}

export default router