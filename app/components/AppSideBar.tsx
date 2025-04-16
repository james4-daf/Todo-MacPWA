'use client';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {useAtom} from 'jotai';
import {todoListsAtom} from '@/app/state/todoLists';
import {Skeleton} from '@/components/ui/skeleton';
import {Home, Plus} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useSyncTodoLists} from "@/app/hooks/useSyncTodoLists";


function slugify(title: string) {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function unslugify(slug: string) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AppSidebar() {
    const syncTodoLists = useSyncTodoLists();
    const [userLists, setUserLists] = useAtom(todoListsAtom);
    const {isMobile, setOpenMobile} = useSidebar();
    // const [userLists, setUserLists] = useState<string[]>([]);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLinkClick = () => {
        if (isMobile) setOpenMobile(false);
    };

    useEffect(() => {
        setTimeout(() => {
            syncTodoLists();
            setLoading(false);
        }, 1000);
    }, [syncTodoLists]);

    const handleAddList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newListTitle.trim() !== '') {
            const newKey = slugify(newListTitle);
            console.log(newKey);
            localStorage.setItem(newKey, JSON.stringify([])); // empty list
            setUserLists((prev) => [...prev, newKey]);
            setNewListTitle('');
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
                                <Link href={`/lists/${key}`} onClick={handleLinkClick}>
                                    {unslugify(key)}
                                </Link>
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
                                            type="text"
                                            placeholder="Add another todo list"
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
