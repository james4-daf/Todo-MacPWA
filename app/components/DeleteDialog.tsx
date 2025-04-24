import { Pencil } from 'lucide-react';

import { useSyncTodoLists } from '@/app/hooks/useSyncTodoLists';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface Props {
  todo: string;
  unslugify: (slug: string) => string;
}

export function DeleteDialog({ unslugify, todo }: Props) {
  const router = useRouter();
  const syncTodoLists = useSyncTodoLists();

  const handleDeleteList = (key: string) => {
    localStorage.removeItem(key);
    syncTodoLists();
    toast(`${unslugify(todo)} list deleted`);
    router.push('/lists');
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pencil className="mr-6" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{`Are you sure you want to delete ${unslugify(
            todo,
          )}?`}</DialogTitle>
          {/*<DialogDescription>*/}
          {/*    Anyone who has this link will be able to view this.*/}
          {/*</DialogDescription>*/}
        </DialogHeader>

        {/*<DialogFooter className="sm:justify-start">*/}
        {/*    <DialogClose asChild>*/}
        {/*        <Button type="button" variant="secondary">*/}
        {/*            Close*/}
        {/*        </Button>*/}
        {/*    </DialogClose>*/}
        {/*</DialogFooter>*/}
        <DialogFooter>
          <div className="pr-8 sm:text-center ">
            <Button
              type="submit"
              size="sm"
              className="px-3"
              variant={'destructive'}
              onClick={() => handleDeleteList(todo)}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
