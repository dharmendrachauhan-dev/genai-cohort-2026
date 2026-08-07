import { QdrantClient } from "@qdrant/js-client-rest";

export const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY
});

export const COLLECTION_NAME= "subtitles"

export async function ensureCollection(){
  try {
    await client.getCollection(COLLECTION_NAME);
    console.log("Collection already exists")
  } catch (error) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 1536,
        distance: "Cosine"
      }
    })
  }

  console.log("✅ Collection created ")
}