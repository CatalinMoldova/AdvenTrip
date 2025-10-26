import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { GroupMember } from '../types';

interface MemberProfileEditSimpleProps {
  member: GroupMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: GroupMember) => void;
}

export function MemberProfileEditSimple({ member, isOpen, onClose, onSave }: MemberProfileEditSimpleProps) {
  const handleSave = () => {
    onSave(member);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile - {member.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Simple edit dialog for {member.name}</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
