import { X } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <button
        type="button"
        className="fixed top-4 right-4 z-50 rounded-md p-2 text-ron-silver hover:text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
