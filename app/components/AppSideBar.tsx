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
    const [userLists, setUserLists] = useState<string[]>([]);
    const [newListTitle, setNewListTitle] = useState("");
    const router = useRouter();

    useEffect(() => {
        const keys = Object.keys(localStorage).filter(
            (key) =>
                !["userTodoLists", "workSessionTodos", "isWhitelist", "undefined"].includes(
                    key
                )
        );
        setUserLists(keys);
    }, []);

    const handleAddList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newListTitle.trim() !== "") {
            const newKey = newListTitle.trim();
            localStorage.setItem(newKey, JSON.stringify([])); // empty list
            setUserLists((prev) => [...prev, newKey]);
            setNewListTitle("");
            router.push(`/${newKey}`);
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
                    {userLists.map((key, id) => (
                        <SidebarGroup key={id}>
                            <Link href={`/${key}`}>{key}</Link>
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
