import OpenAI from "openai"

const client = new OpenAI();

export async function askOpenAI(question){
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: question
    })
    return response.output_text
}


