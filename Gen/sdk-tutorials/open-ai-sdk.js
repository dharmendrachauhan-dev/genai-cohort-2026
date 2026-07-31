import OpenAI from "openai"
import dotenv from "dotenv"
import { z } from "zod"
import { zodTextFormat } from "openai/helpers/zod"

dotenv.config()
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


const riskSchema = z.object({
    title: z.string().describe("the actual title for risk"),
    tags: z.array(z.string()).describe('3-4 tags for this risk'),
    score: z.number().min(1).max(5).describe("risk levelo out of 5")
})


const outputSchema = z.object({
    risks: z.array(riskSchema).describe("array of risks")
});

async function main() {
    const response = await client.responses.parse({
        model: "gpt-4o-mini",
        text: {
            format: zodTextFormat(outputSchema, "risks")
        },
        input: `
        Extract the risk from the document

        Document :
        This project uses AI to help teams summarize customer feedback.
        Users can submit 
        feedback through a secure web interface.
        The system stores 
        summaries for later review and reporting.
        Access should be 
        limited to authorized 
        team members.

        please list any risks you find in the document above
        `
    })
    console.log(response.output_parsed.risks[0].title)
}

main()