import { askOpenAI } from "./openai.service.js";

export async function judge({question, openai, gemini}){
    const prompt = `
    You are an expert Philospher who readed a lots of philosophy books.
    
    So here user asked you this questions:
    "${question}"

    There this two ai response
    OpenAI Response
    - ${openai}

    GeminiAI Response
    - ${gemini}

    What You gonna do is: 
    
    Step 1 : Compare both responses.
    Step 2 : Choose the better response.
    Step 3 : If both contein userful information, combine them into one for clear, accurate answer.
    Step 4 : Do not mention which model wrote the answer.
    Step 5 : Return only the combine or most accurate answer .
`

const bestAnswer = await askOpenAI(prompt)

return bestAnswer;

}
