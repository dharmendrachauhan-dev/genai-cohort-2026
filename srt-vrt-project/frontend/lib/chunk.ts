export type Subtitle = {
    start: number;
    end: number;
    text: string;
}


export function chunkSubtitles(
    substitles: Subtitle[],
    chunkSize = 5
){
    const chunks = []

    for (let i = 0; i< substitles.length; i +=chunkSize){
        const group = substitles.slice(i, i + chunkSize);

        chunks.push({
            start: group[0].start,
            end: group[group.length - 1].end,
            text: group.map((item)=> item.text).join(" "),
        })
    }

    return chunks;
}