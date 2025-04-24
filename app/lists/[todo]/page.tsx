'use client';

import { useSyncTodoLists } from '@/app/hooks/useSyncTodoLists';
import { todoListsAtom } from '@/app/state/todoLists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputNoBorder } from '@/components/ui/inputNoBorder';
import { Separator } from '@/components/ui/separator';
import { useAtom } from 'jotai';
import { Loader2, NotepadText, Square, SquareCheckBig, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DeleteDialog } from '@/app/components/DeleteDialog';

type TodoItem = {
  text: string;
  completed: boolean;
};

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TodoPage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [, setUserLists] = useAtom(todoListsAtom);
  const [showUploadTodo, setShowUploadTodo] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const syncTodoLists = useSyncTodoLists();
  const [summary, setSummary] = useState<string | null>(null);
  const todo = slugify(params?.todo as string);
  const displayTitle = unslugify(params?.todo as string);
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(todo);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      } catch (e) {
        console.error('Failed to parse localStorage for', todo, e);
      }
    }
  }, [todo]);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(todo, JSON.stringify(todos));
    }
  }, [todos, todo]);

  useEffect(() => {
    syncTodoLists();
  }, [syncTodoLists]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      setTodos((prev) => [...prev, { text: input.trim(), completed: false }]);
      setInput('');
    }
  };

  function slugify(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word characters
      .replace(/\s+/g, '-'); // replace spaces with hyphens
  }

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Enter' && editInput.trim() !== '') {
      setTodos((prev) =>
        prev.map((todo, idx) =>
          idx === index ? { ...todo, text: editInput } : todo,
        ),
      );
      setEditingIndex(null);
    }
  };

  const toggleCompleted = (index: number) => {
    setTodos((prev) =>
      prev.map((todo, idx) =>
        idx === index ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(
      (key) =>
        ![
          'userTodoLists',
          'workSessionTodos',
          'isWhitelist',
          'undefined',
        ].includes(key),
    );
    setUserLists(keys);
  }, []);

  return (
    <div className="px-4 py-6 max-w-screen-sm mx-auto w-full">
      <div className=" flex flex-wrap">
        <h1 className="l:text-2xl  font-bold mb-4 pr-18">{displayTitle}</h1>

        <DeleteDialog todo={todo} unslugify={unslugify} />
        {/*<Pencil onClick={() => handleDeleteList(todo)}/>*/}

        <Button
          className="cursor-pointer"
          onClick={() => setShowUploadTodo((prev) => !prev)}
        >
          Upload your paper todo
          <NotepadText />
        </Button>
      </div>
      {showUploadTodo && (
        <>
          <Input
            className="border-2 mb-4 cursor-pointer"
            type="file"
            placeholder="new upload"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
          />

          <Button
            disabled={loading || !file}
            className="cursor-pointer mb-4"
            onClick={async () => {
              if (!file || loading) return;
              setLoading(true);
              toast('Analyzing Image...');

              const formData = new FormData();
              formData.append('image', file);

              try {
                const res = await fetch('/api/image-to-text', {
                  method: 'POST',
                  body: formData,
                });
                const data = await res.json();
                console.log('🧠 AI Summary:', data.text);
                if (data.text) {
                  setSummary(data.text);

                  const newItems = data.text
                    .split('\n')
                    .map((line: string) => line.trim())
                    .filter((line: string) => line.length > 0)
                    .map((text: string) => ({ text, completed: false }));

                  setTodos((prev) => {
                    const updated = [...prev, ...newItems];
                    localStorage.setItem(todo, JSON.stringify(updated));
                    return updated;
                  });
                  setSummary(null);
                  setFile(null);
                }
              } catch (err) {
                console.error('❌ Upload failed:', err);
              } finally {
                setLoading(false);
                setShowUploadTodo(false);
                toast('Successfully added todos');
              }
            }}
          >
            {loading ? (
              <>
                Analyzing...
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              </>
            ) : summary ? (
              'Done'
            ) : (
              'Extract todo from Image'
            )}
          </Button>
        </>
      )}

      <ul className="mt-4 list-none space-y-2">
        {todos.map((todo, idx) => (
          <div key={idx}>
            <li
              className={`flex items-center py-3 px-2 space-x-2 rounded cursor-pointer ${
                todo.completed
                  ? 'bg-gray-100 text-gray-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span
                onClick={() => toggleCompleted(idx)}
                className="cursor-pointer"
              >
                {todo.completed ? <SquareCheckBig /> : <Square />}
              </span>
              <div
                className="flex-1"
                onClick={() => {
                  setEditingIndex(idx);
                  setEditInput(todo.text);
                }}
              >
                {editingIndex === idx ? (
                  <InputNoBorder
                    type="text"
                    autoFocus
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, idx)}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className={`${
                      todo.completed ? 'line-through' : ''
                    } cursor-pointer`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              {todo.completed && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(idx);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                  >
                    <X />
                  </button>
                </>
              )}
            </li>
            <Separator className="" />
          </div>
        ))}
      </ul>
      <InputNoBorder
        className="w-full mt-2 p-2 cursor-text"
        type="text"
        placeholder="Add a todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
