"use client"

import {useEffect, useState} from "react";

export default function TodoPage(props) {
    const {todo} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [list, setList] = useState<{ title: string; items: { title: string; url: string }[] } | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const stored = localStorage.getItem("userTodoLists");
        if (stored && todo) {
            try {
                const parsed = JSON.parse(stored);
                const found = parsed.find((l: any) => l.title === todo);
                setList(found || null);
            } catch (e) {
                console.error("Failed to parse localStorage:", e);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [todo]);

    if (isLoading) {
        return <p className="p-6">Loading...</p>;
    }

    // if (!list) {
    //     return <p className="p-6">Todo list not found.</p>;
    // }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{list?.title}</h1>
            <ul className="list-disc pl-6 space-y-2">
                {list?.items.map((item, idx) => (
                    <li key={idx}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}