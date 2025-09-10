'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoCreationPage from '@/app/create/page';

interface FacelessVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacelessVideoModal({ open, onOpenChange }: FacelessVideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen max-h-screen w-screen max-w-none top-0 translate-y-0 pt-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Create Video</DialogTitle>
        </DialogHeader>
        <VideoCreationPage />
      </DialogContent>
    </Dialog>
  );
}
