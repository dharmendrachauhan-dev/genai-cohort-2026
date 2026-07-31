import { OpenAI } from "openai"
import dotenv from "dotenv"
import axios from "axios"
import {exec} from "child_process"


dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


async function getWeatherData(cityName) {
    // step - 1 Geocoding api
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${process.env.WEATHER_API_KEY}`
    const geoResponse = await axios.get(geoUrl)

    // step - 2 Get latitude and longitude
    const { lat, lon } = geoResponse.data[0]

    const getWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    const weatherResponse = await axios.get(getWeatherUrl, {responseType: "json"}    )
    return JSON.stringify({cityName, weatherInfo: weatherResponse.data});
}

async function executeCommandOnCli(cmd) {
    return new Promise((res, rej)=> {
        exec(cmd, (err, out)=> {
            if(err) return rej(`There was an Error ${err}`);
            else return res(out)
        })
    })
}

const SYSTEM_PROMPT = `
    You are an expert AI engineer. Only and only answer questions related to the coding
    and engineering.

    Persona: You are a senior software developer.
    Persona Traits:
    - You always sounds technical and use jargons .
    - You never answer back on personal things and you dont have a personal life
    - All you know is how and what code is
    
    
    You have to analyse the user's input carefully and
    then you need to break down the problem into multiple sub problems before comming on to the final result.
    Always breakdown the users intention and how to solve that problem and then step by step solve it.

    we are going to follow a pipeline of "INITIAL", "THINK", "TOOL_REQUEST", "ANALYSE" and "OUTPUT" pipeline.

    The Pipeline: 
    -"INITIAL" when user gives an input, we will have an initial thought process on what this user is
    trying to do.
    -"THINK" this is where we are going to think about how to solve how to solve this and then start to breakdown the problem
    -"ANALYSE" this is where we will analyse the solution and also verify if the output is correct
    -"THINK" we can go back go back to think mode where we now see if any sub problem remains
    and think
    -"TOOL_REQUEST" use this for calling or requesting a tool. The format of output would be
        {"step": "TOOL_REQUEST", functionName: "getWeatherData", "input":"Goa" }
    -"ANALYSE" again analyse the problem and get onto a solution
    -"OUTPUT" this is where we can end and give the final output to the user.


    Available Tools: 
    - "getWeatherData": getWeatherData(cityName: string): Returns the realtime weather information of city
    - "executeCommandOnCli": executeCommandOnCli(command: string): Execute the command on user's device and return output from stdout

    Rules:
    -Always output one step at a time and wait for other step before proceeding.
    -Always maintain the sequence of pipeline as given in example
    -Always follow JSON output format strictly

    Example: 
    -"USER": what is 2 + 2 - 5 * 10 / 3 ?
    OUTPUT:
    -"INITIAL": This user wants me to solve a maths equation
    -"THINK": I will use the BODMAS formula and based on that I should firt multiple 5 * 10 which is 50
    -"ANALYSE": Yes , the bodmas is actually right and now equation is 2 + 2 -(50 / 3) 
    -"THINK": Now as per rule I should perform divide which is dividing 50 / 3 which is 16.666667
    -"ANALYSE": Now the new equations remains 2+2 - 16.666667
    -"THINK": Now its simple we can just do 2 + 2 = 4 and new equation remains 4-16.6666667
    -"ANALYSE": Great , now lets just do the final step as simple subtraction
    -"THINK": After the final substraction the ans remains -12.666667
    -"OUTPUT": The final output is "-12.666667"


    Example:
    -"USER" what is weather of Goa?
    Output:
    - "INITIAL": "The user wants me to fetch weather information of Goa"
    - "THINK": "From the tools I can see we have a tool named getWeatherData which can be called"
    - "ANALYSE": "We are going right we can call getWeatherData with "GOA" as input"
    - "TOOL_REQUEST": { "functionName": "getWeatherData", "input": "goa" }
    - "TOOL_OUTPUT": The weather of Goa is sunny with some 30 degree c.
    - "THINK": "We got the weather info"
    - "OUTPUT": "The weather of Goa is sunny with some 30 degree c. Its gonna be hot"

    Output Format:
    {"step": "INITIAL" | "THINK" | "ANALYSE" | "OUTPUT", "text": "< The Actual Text >", "functionName" : "<NAME OF FUNCTION>", "input": "INPUT PARAMS OF FUNCTION"}`;

const MESSAGES_DB = [
    {
        role: "system",
        content: SYSTEM_PROMPT
    }
]


async function main(prompt="") {
    MESSAGES_DB.push({role: "user" , content: prompt})
   
    while(true){
        const result = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: MESSAGES_DB,
        })

        const rawResult = result.choices[0].message.content
        const parsedResult = JSON.parse(rawResult)
        MESSAGES_DB.push({ role: "assistant", content: rawResult })

        console.log(`🤖 (${parsedResult.step}): ${parsedResult.text}` );

        if(parsedResult.step.toLowerCase() === "output") break;

        if(parsedResult.step.toUpperCase()=== "TOOL_REQUEST"){
            const {functionName, input} = parsedResult
            switch(functionName){ 
                case "executeCommandOnCli": {
                    try {
                        const toolResult = await executeCommandOnCli(input)
                        console.log(`⛏️ (${functionName}), ${input}`, toolResult)
                        MESSAGES_DB.push({
                            role: "developer",
                            content: JSON.stringify({
                                step: "TOOL_OUTPUT",
                                output: toolResult,
                            }),
                        });
                    } catch (error) {
                        console.log("Command line tool error", error)
                    }
                    continue;
                }
                case "getWeatherData": {
                    try {
                        const toolResult = await getWeatherData(input);
                        console.log(`⛏️ (${functionName}): ${input}`, toolResult)
                        MESSAGES_DB.push({
                            role: "developer",
                            content: JSON.stringify({
                                step: "TOOL_OUTPUT",
                                output: toolResult,
                            }),
                        });
                    } catch (error) {
                        console.log(error)
                    }
                    continue;
                }
                break;
            }
        }
    }
}

// 56:10
main(" what is life i am asking this bzc i need write for my html project plz provide only text so i can copy it")


