import fs from "fs";
import OpenAI from "openai";
import path from "path";
import {NextResponse} from "next/server";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function GET() {
    try {
        console.log("🧠 /api/image-to-text called");

        const imagePath = "public/todolist.png";
        console.log("🖼 Looking for:", imagePath);

        if (!fs.existsSync(imagePath)) {
            console.error("🚫 File does not exist!");
            return NextResponse.json({error: "Image not found"}, {status: 404});
        }

        const base64Image = fs.readFileSync(imagePath, {encoding: 'base64',});

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Create a json structure for all the items in the todo list Return only the json structure."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
        });

        const text = completion.choices[0].message.content;
        console.log("📝 GPT-4O output:", text);

        return NextResponse.json({text});
    } catch (err) {
        console.error("🔥 API route error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}