'use client';
import { useSyncTodoLists } from '@/app/hooks/useSyncTodoLists';
import { todoListsAtom } from '@/app/state/todoLists';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useAtom } from 'jotai';
import { Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AppSidebar() {
  const syncTodoLists = useSyncTodoLists();
  const [userLists, setUserLists] = useAtom(todoListsAtom);
  const { isMobile, setOpenMobile } = useSidebar();
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
      if (isMobile) setOpenMobile(false);
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
                    <Home />
                    <span>Work Todos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator />
            </SidebarMenu>
          </SidebarGroupContent>
          {loading ? (
            <div className="space-y-2 px-4 py-2">
              <Skeleton className="h-4 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
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
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 rounded-md border border-muted bg-muted/40 px-3 py-2 transition-all focus-within:border-ring focus-within:bg-background focus-within:shadow-sm">
                <Plus className="text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Add new list..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={handleAddList}
                  className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
