import { indexSubtitleFile } from "@/lib/services/index-subtitles";


export async function POST(req: Request) {
    try {

        const formData = await req.formData();
        const file = formData.get("file") as File;

        const result = await indexSubtitleFile(file);

        return Response.json({
            success: true,
            uploaded: result
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Unable to index subtitle",
            },
            {
                status: 500,
            }
        );
    }
}