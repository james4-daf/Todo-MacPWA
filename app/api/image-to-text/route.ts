import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({error: "No file uploaded"}, {status: 400});
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {type: "text", text: "Extract all visible text from this image. Return it as plain text."},
                        {type: "image_url", image_url: {url: base64Image}},
                    ],
                },
            ],
        });

        const text = completion.choices[0].message.content;
        return NextResponse.json({text});
    } catch (err) {
        console.error("🔥 Error in image-to-text:", err);
        return NextResponse.json({error: "Failed to extract text"}, {status: 500});
    }
}