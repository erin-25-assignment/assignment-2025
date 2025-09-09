"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/types';
import { initialNotes } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedNotes = localStorage.getItem('memomind-notes');
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            } else {
                setNotes(initialNotes);
            }
        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
            setNotes(initialNotes);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('memomind-notes', JSON.stringify(notes));
        }
    }, [notes, isMounted]);

    const addNote = useCallback((noteInput: NoteInput) => {
        const newNote: Note = {
            id: uuidv4(),
            ...noteInput,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        };
        setNotes(prev => [newNote, ...prev]);
        return newNote;
    }, []);

    const updateNote = useCallback((updatedNote: Note) => {
        setNotes(prev => prev.map(note => 
            note.id === updatedNote.id 
            ? { ...updatedNote, updatedAt: new Date().toISOString() } 
            : note
        ));
    }, []);

    const deleteNote = useCallback((id: string) => { // This now sends to trash
        setNotes(prev => prev.map(note => 
            note.id === id ? { ...note, deletedAt: new Date().toISOString() } : note
        ));
    }, []);
    
    const restoreNote = useCallback((id: string) => {
        setNotes(prev => prev.map(note => 
            note.id === id ? { ...note, deletedAt: null } : note
        ));
    }, []);

    const permanentlyDeleteNote = useCallback((id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    }, []);

    const emptyTrash = useCallback(() => {
        setNotes(prev => prev.filter(note => !note.deletedAt));
    }, []);

    const restoreAllFromTrash = useCallback(() => {
        setNotes(prev => prev.map(note => note.deletedAt ? { ...note, deletedAt: null } : note));
    }, []);

    return { notes, setNotes, addNote, updateNote, deleteNote, restoreNote, permanentlyDeleteNote, emptyTrash, restoreAllFromTrash };
}
