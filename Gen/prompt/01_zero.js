import {OpenAI} from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


async function main() {
    const result = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role: "user", content: "what is 2 + 2"}]
    })
    console.log(result)
    console.log(`Ans from gpt: `, result.choices[0].message.content)
}


main()