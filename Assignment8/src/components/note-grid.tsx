"use client";

import type { FC } from 'react';
import type { Note } from '@/lib/types';
import NoteCard from './note-card';

interface NoteGridProps {
    notes: Note[];
    onEditNote: (id: string) => void;
    onDeleteNote: (id: string) => void;
    onSetPriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
    onRestoreNote?: (id: string) => void;
    isTrashView?: boolean;
}

const NoteGrid: FC<NoteGridProps> = ({ notes, onEditNote, onDeleteNote, onSetPriority, onRestoreNote, isTrashView = false }) => {
  return (
    <div className="px-4 md:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {notes.map(note => (
        <NoteCard 
            key={note.id} 
            note={note} 
            onEdit={onEditNote} 
            onDelete={onDeleteNote} 
            onSetPriority={onSetPriority}
            onRestore={onRestoreNote}
            isTrashView={isTrashView}
        />
      ))}
    </div>
  );
};

export default NoteGrid;
