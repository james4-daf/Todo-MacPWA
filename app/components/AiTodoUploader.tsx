"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function AiTodoUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [todos, setTodos] = useState<string[]>([]);
    const router = useRouter();

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/extract-todos", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("AI raw response:", data);
        const rawText = data.text || "";
        setTodos([rawText]);
        localStorage.setItem("ai_todos", JSON.stringify([rawText]));
        setLoading(false);
        router.push("/ai");
    };

    return (
        <div className="p-4 space-y-4">
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button disabled={!file || loading} onClick={handleUpload}>
                {loading ? "Analyzing..." : "Extract Todos"}
            </Button>

            {todos.length > 0 && (
                <ul className="mt-4 list-disc pl-6">
                    {todos.map((todo, idx) => (
                        <li key={idx}>{todo}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
