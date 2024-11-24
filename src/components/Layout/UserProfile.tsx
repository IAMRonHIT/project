import React from 'react';

export function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <p className="text-sm font-medium text-white">Dr. Sarah Chen</p>
        <p className="text-xs text-white/60">Chief Medical Officer</p>
      </div>
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-ron-primary to-ron-secondary p-[2px]">
        <div className="h-full w-full rounded-full bg-ron-dark-navy flex items-center justify-center">
          <span className="text-sm font-medium text-white">SC</span>
        </div>
      </div>
    </div>
  );
}