import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { cn } from '../../../src/lib/utils';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { NewTaskForm } from './NewTaskForm';

export function NewTaskDialog() {
  const { theme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "gap-2 relative bg-white hover:bg-white/90",
            theme === 'dark' && "bg-[#334155] hover:bg-[#334155]/90 text-white"
          )}
        >
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task and manage stakeholders
          </DialogDescription>
        </DialogHeader>
        <NewTaskForm />
      </DialogContent>
    </Dialog>
  );
}