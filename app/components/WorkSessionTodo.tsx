"use client"
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";

type TodoItem = {
    text: string;
    completed: boolean;
};

export default function WorkSessionTodo() {
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState<TodoItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("workSessionTodos");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTodos(parsed);
                }
            } catch (e) {
                console.error("Failed to parse stored todos:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem("workSessionTodos", JSON.stringify(todos));
        }
    }, [todos]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim() !== "") {
            setTodos((prev) => [...prev, {text: input.trim(), completed: false}]);
            setInput("");
        }
    };

    const toggleCompleted = (index: number) => {
        setTodos((prev) =>
            prev.map((todo, idx) =>
                idx === index ? {...todo, completed: !todo.completed} : todo
            )
        );
    };

    const deleteTodo = (index: number) => {
        setTodos((prev) => prev.filter((_, idx) => idx !== index));
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">This session&#39;s work</h1>
            <Input
                placeholder="Add a todo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <ul className="mt-4 list-disc space-y-2">
                {todos.map((todo, idx) => (
                    <li
                        key={idx}
                        className="flex items-center py-3 space-x-2  pl-2 before:content-['•'] before:mr-2 before:text-xl"
                        onDoubleClick={() => toggleCompleted(idx)}
                    >
            <span className={`${
                todo.completed ? "line-through" : ""
            } cursor-pointer`}
            >{todo.text}</span>
                        {todo.completed && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTodo(idx);
                                }}
                                className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                            >
                                X
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}