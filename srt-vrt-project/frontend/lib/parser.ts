import subsrt from "subsrt-ts"
import { type Subtitle } from "@/lib/chunk"

export function parseSubtitle(content: string): Subtitle[] {
    return subsrt
        .parse(content)
        .filter((item) => item.type === "caption")
        .map((item) => ({
            start: item.start,
            end: item.end,
            text: item.text,
        }))
}