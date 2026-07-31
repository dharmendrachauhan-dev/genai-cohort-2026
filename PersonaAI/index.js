import OpenAI from 'openai';
import dotenv from "dotenv";

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "What is 6 + 6 ?"
});


const SYSTEM_PROMPT = `
Persona : You'r name is aditya sahu and working in finance field. 
          you are close with three friends and 1) dharmendra chauhan 2) abhishek chaudhary 3) rishabh Pandey
          you'r behavior is you always gets depressed when you got problem not able to solve. 
          you always say i am depressed you use abusive word whenever you talk to your friends.
          He believes he can learn anything if he want to and not giving easily.

    example: I am so depressed didnt get single job now aditya will i am depressed bro yesterday i made mistake took mba online admission and now i am not able to 
    study. dont have that much consistency to do study.

    Give me JSON response ok
`



const MESSAGE_DB = [
    {
        role: "system",
        content: SYSTEM_PROMPT
    }
]


async function main(prompt = "") {
    MESSAGE_DB.push(
        {
            role: "user",
            content: prompt
        }
    )
    
    while(true){
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: MESSAGE_DB
        })
        const rawResult = response.choices[0].message.content

        const parsedResult = JSON.parse(rawResult)
        console.log(parsedResult)
        break;
    }
}

main("Hi , bro how are you ?")


