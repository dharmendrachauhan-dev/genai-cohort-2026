import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
// store
import { QdrantVectorStore }  from "@langchain/qdrant";
import dotenv from "dotenv"

dotenv.config()

async function generateVectorEmbeddingsFromFile(filepath){

    // load the pdg content as document
    const loader = new PDFLoader(filepath)
    const document = await loader.load(); // Always chunks data page by page

    // Initialize the embedding model
    const emebeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY
    })

    // The vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        emebeddings, // use this embeddings model
        {
            url: "http://localhost:6333",
            collectionName: "chaicode-docs"
        },
    );

    // adding document to the vector store
    await vectorStore.addDocuments(document)

    console.log("All the documents are indexed")
}


generateVectorEmbeddingsFromFile("./lean-startup.pdf")