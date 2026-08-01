import {OpenAIEmbeddings} from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai"

import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function query(userQuery) {
    // convert user query to vector embeddings?

    // Initialize the embedding model
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY
    })
    // search the vectors in the qdrant
    // The vector store

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "chaicode-docs"
        }
    )

    // get similar vector and chunks?

    const vectorRetriver = vectorStore.asRetriever({k: 5});
    const result = await vectorRetriver.invoke(userQuery);

    // feed those chunks to llm model feed those chunks to llm model and do a simple chat withh {userQuery}

    const SYSTEM_PROMPT = `
        You are an expert in answering user query based on the provided context about document.
        Do not answer anything beyond what is not provided.

        Always also answer the user in short and tell on which page number that content is available.

        User Documents:
        ${result.map((e)=> JSON.stringify({
            pageContent: e.pageContent , pageNumber: e.metadata.loc.pageNumber
        }))}
    `

    const llmResponse = await client.responses.create({
        model: "gpt-4o",
        input: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: userQuery
            }
        ]
    })

    console.log(`LLM Respose: `, llmResponse.output_text)
}

query("give me a paragraph of LEARN?")