import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config()
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const stream = await client.responses.create({
  model: "gpt-4o-mini",
  input: "what is sunflower?",
  stream: true
});

for await (const event of stream){
    if (event && event.delta) process.stdout.write(event.delta)
    
}
