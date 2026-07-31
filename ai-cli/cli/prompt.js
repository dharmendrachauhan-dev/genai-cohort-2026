import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import router from "../orchestrator/router.js"


async function startCLI() {
    const readline = createInterface({
        input: stdin,
        output: stdout,
    })

    while (true) {
        const question = await readline.question("> ")
        if (question === "exit") {
            console.log("Bye Bro 👋")
            break;
        }

        console.log(`You asked : ${question}`)

        const answer = await router(question)
        console.log(`🤖 : ${answer}`)
        break;
    }

    readline.close()
}


export default startCLI



