"use client"
import {Home, Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {Input} from "@/components/ui/input";
import Link from "next/link";

// Define the type of a stored list
type TodoList = {
    title: string;
    items: { title: string; url: string }[];
};

export function AppSidebar() {
    const [userLists, setUserLists] = useState<TodoList[]>([]);
    const [newListTitle, setNewListTitle] = useState("");
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("userTodoLists");
        if (stored) {
            try {
                setUserLists(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored todo lists:", e);
            }
        }
    }, []);

    const handleAddList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newListTitle.trim() !== "") {
            const newUrl = `/${(newListTitle.trim())}`;
            const newList: TodoList = {
                title: newListTitle.trim(),
                items: [],
            };
            const updatedLists = [...userLists, newList];
            localStorage.setItem("userTodoLists", JSON.stringify(updatedLists));
            setUserLists(updatedLists);
            setNewListTitle("");
            router.push(newUrl);
        }
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>This session's todos</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/">
                                        <Home/>
                                        <span>Work Todos</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    {userLists.map((list, id) => (
                        <SidebarGroup key={id}>
                            <Link href={list.title}>{list.title}</Link>

                        </SidebarGroup>
                    ))}
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex items-center gap-2 w-full px-2">
                                        <Plus/>
                                        <Input
                                            placeholder='Add another todo list'
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            onKeyDown={handleAddList}
                                            className="w-full"
                                        />
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
}
