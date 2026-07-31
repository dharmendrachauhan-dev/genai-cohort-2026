import {OpenAI} from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


async function main() {
    const result = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role: "user", content: `
            what is 2 + 2 equals ?
            Do not add anything else in ans, take the samples from the examples.
            Example:
            - what is 5 + 4 ?
            Expected Output: 9 (nine)
            - what is 10 + 10
            Expected Output: 20 (Ten)
            - 
            `}]
    })
    console.log(`Ans from gpt: `, result.choices[0].message.content)
}


main()