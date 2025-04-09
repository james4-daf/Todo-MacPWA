"use client";

import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {InputNoBorder} from "@/components/ui/inputNoBorder";

type TodoItem = {
    text: string;
    completed: boolean;
};

export default function TodoPage() {
    const params = useParams();
    const todo = params?.todo as string;
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editInput, setEditInput] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem(todo);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTodos(parsed);
                }
            } catch (e) {
                console.error("Failed to parse localStorage for", todo, e);
            }
        }
    }, [todo]);

    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem(todo, JSON.stringify(todos));
        }
    }, [todos, todo]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim() !== "") {
            setTodos((prev) => [...prev, {text: input.trim(), completed: false}]);
            setInput("");
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter" && editInput.trim() !== "") {
            setTodos((prev) =>
                prev.map((todo, idx) =>
                    idx === index ? {...todo, text: editInput} : todo
                )
            );
            setEditingIndex(null);
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
        <div className="p-12">
            <h1 className="text-2xl font-bold mb-4">{todo}</h1>
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
                        className="items-center py-3 space-x-2 pl-2 hover:bg-gray-50 hover:cursor-text"
                        // onDoubleClick={() => toggleCompleted(idx)}
                        onClick={() => {
                            setEditingIndex(idx);
                            setEditInput(todo.text);
                        }}
                    >
                        {editingIndex === idx ? (
                            <InputNoBorder
                                autoFocus
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, idx)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                // className={`${
                                //     todo.completed ? "line-through" : ""
                                // } cursor-pointer`}
                            >
                                {todo.text}
                            </span>
                        )}
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
                        <Separator className=""/>
                    </li>
                ))}
            </ul>
        </div>
    );
}