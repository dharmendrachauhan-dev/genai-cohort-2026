import { parseSubtitle } from "@/lib/parser";

export async function POST(req: Request){
    const formData = await req.formData();
    const file = formData.get("file") as File
    const content = await file.text();
    const subtitles = parseSubtitle(content);

    return Response.json(subtitles)
}