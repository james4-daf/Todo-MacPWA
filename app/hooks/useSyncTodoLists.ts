// app/hooks/useSyncTodoLists.ts
"use client";
import {useCallback} from "react";
import {useSetAtom} from "jotai";
import {todoListsAtom} from "@/app/state/todoLists";

export function useSyncTodoLists() {
    const setTodoLists = useSetAtom(todoListsAtom);

    return useCallback(() => {
        const keys = Object.keys(localStorage).filter(
            (key) =>
                ![
                    "userTodoLists",
                    "workSessionTodos",
                    "isWhitelist",
                    "undefined",
                ].includes(key)
        );
        setTodoLists(keys);
    }, [setTodoLists]);
}