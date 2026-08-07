import { chunkSubtitles } from "@/lib/chunk";
import { generateEmbedding } from "@/lib/openai";
import { client, COLLECTION_NAME, ensureCollection } from "@/lib/qdrant";
import { parseSubtitle } from "../parser";
import { createHash } from "crypto";

export async function indexSubtitleFile(file: File) {

    //Read updoaded file
    const content = await file.text();

    // Parsesubtitles
    const subtitles = parseSubtitle(content)

    // created chunks
    const chunks = chunkSubtitles(subtitles, 5)

    await ensureCollection() // ensuring the collection exits


    // Generate a unique hash for the file
    const fileHash = createHash("sha256")
        .update(content)
        .digest("hex");

    const points = []

    for (const chunk of chunks) {
        // Generate Embedding for every chunk
        const embedding = await generateEmbedding(chunk.text)

        //Prepare Qdrant point
        points.push({
            id: crypto.randomUUID(),
            vector: embedding,
            payload: {
                fileName: file.name,
                fileHash,
                text: chunk.text,
                start: chunk.start,
                end: chunk.end,
            }
        })

    }

    //upload all points in one request
    await client.upsert(COLLECTION_NAME, {
        wait: true,
        points
    })

    return {
        fileName: file.name,
        chunks: chunks.length,
        uploaded: points.length,
    }
}