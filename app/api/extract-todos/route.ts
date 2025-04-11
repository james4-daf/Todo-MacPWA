// app/api/extract-todos/route.ts
import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({error: "No image file found"}, {status: 400});
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64Image = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString("base64")}`;

        const prompt = `Read all visible text from this handwritten note image. Return the raw text exactly as it appears, without rephrasing or summarizing.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            {type: "text", text: prompt},
                            {type: "image_url", image_url: {url: base64Image}},
                        ],
                    },
                ],
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        // console.log("AI raw response route:", data);
        const text = data?.choices?.[0]?.message?.content || "";
        console.log("AI raw output:\n", text);

        return NextResponse.json({text});
    } catch (err) {
        console.error("OCR error:", err);
        return NextResponse.json({error: "Failed to extract todos"}, {status: 500});
    }
}