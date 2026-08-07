import { chunkSubtitles } from "@/lib/chunk";
import {readFile} from "fs/promises"
import path from "path"
import subsrt from "subsrt-ts"
import { type Subtitle } from "@/lib/chunk"
import { generateEmbedding } from "@/lib/openai";


export async function GET(){
 try {
       const filePath = path.join(
           process.cwd(),
           "srt-file",
           "01_what-is-mobile-development_epm",
           "01_what-is-mobile-development_epm.srt"
       )
       
       //Read File
       const content = await readFile(filePath, "utf8");

       // Parse
       const parsedSubtitles = subsrt.parse(content)

       // Normalise Data
       const normalizedSubtitles: Subtitle[] = parsedSubtitles
       .filter((item) => item.type === "caption")
       .map((item) => ({
        start: item.start,
        end: item.end,
        text: item.text,
       }))

       // created chunks
       const chunks = chunkSubtitles(normalizedSubtitles, 5)

       const points = []
       
       for (const chunk of chunks){
        // Generate Embedding for every chunk
        const embedding = await generateEmbedding(chunk.text)
        
        //Prepare Qdrant point
        points.push({
            id: crypto.randomUUID(),
            vector: embedding,
            payload: {
                text: chunk.text,
                start: chunk.start,
                end: chunk.end,
            }
        })

        console.log(points)

        return Response.json(
            {
                totalChunks: chunks.length,
                totalPoints: points.length
            }
        )
       }
 } catch (error) {
    console.error(error)

    return Response.json(
        {
            error: "unable to parse subtitle"
        },
        {
            status: 500
        }
    );
 }    
}