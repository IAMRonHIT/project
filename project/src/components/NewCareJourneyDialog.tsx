import React from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function NewCareJourneyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderPlus className="w-4 h-4" />
          New Journey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Care Journey</DialogTitle>
          <DialogDescription>
            Create a new care journey and associate it with a patient, provider, or health plan
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-400">Journey Type</label>
            <select className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="patient">Patient-specific Journey</option>
              <option value="provider">Provider-related Journey</option>
              <option value="healthplan">Health Plan Journey</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-400">Journey Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter journey name..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-400">Description</label>
            <textarea
              className="w-full px-4 py-2 bg-[#020817] border border-cyan-900/30 rounded-lg text-cyan-400 placeholder:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
              placeholder="Describe the purpose of this care journey..."
            />
          </div>

          <div className="pt-4 border-t border-cyan-900/30">
            <Button className="w-full">Create Care Journey</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}