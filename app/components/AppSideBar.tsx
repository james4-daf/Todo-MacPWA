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
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {useSidebar} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

export function AppSidebar() {
    const {isMobile, setOpenMobile} = useSidebar();
    const [userLists, setUserLists] = useState<string[]>([]);
    const [newListTitle, setNewListTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLinkClick = () => {
        if (isMobile) setOpenMobile(false);
    };

    useEffect(() => {
        setTimeout(() => {

            const keys = Object.keys(localStorage).filter(
                (key) =>
                    !["userTodoLists", "workSessionTodos", "isWhitelist", "undefined"].includes(key)
            );
            setUserLists(keys);
            setLoading(false);

        }, 1000);
    }, []);

    const handleAddList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newListTitle.trim() !== "") {
            const newKey = newListTitle.trim();
            localStorage.setItem(newKey, JSON.stringify([])); // empty list
            setUserLists((prev) => [...prev, newKey]);
            setNewListTitle("");
            router.push(`/lists/${newKey}`);
        }
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>This session&#39;s todos</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/lists/thissession" onClick={handleLinkClick}>
                                        <Home/>
                                        <span>Work Todos</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    {loading ? (
                        <div className="space-y-2 px-4 py-2">
                            <Skeleton className="h-4 w-3/4 rounded-xl"/>
                            <Skeleton className="h-4 w-2/3 rounded-full"/>
                            <Skeleton className="h-4 w-1/2 rounded-full"/>
                        </div>
                    ) : (
                        userLists.map((key, id) => (
                            <SidebarGroup key={id}>
                                <Link href={`/lists/${key}`} onClick={handleLinkClick}>{key}</Link>
                            </SidebarGroup>
                        ))
                    )}
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex items-center gap-2 w-full px-2">
                                        <Plus/>
                                        <Input
                                            type='text'
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
                <Button>Add paper todo</Button>
            </SidebarContent>
        </Sidebar>
    );
}
