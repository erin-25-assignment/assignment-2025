"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { initialCategories } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedCategories = localStorage.getItem('memomind-categories');
            const loadedCategories = storedCategories ? JSON.parse(storedCategories) : initialCategories;
            setCategories(loadedCategories);
        } catch (error) {
            console.error("Failed to load categories from localStorage", error);
            setCategories(initialCategories);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('memomind-categories', JSON.stringify(categories));
        }
    }, [categories, isMounted]);

    const addCategory = useCallback((name: string) => {
        const newCategory: Category = {
            id: uuidv4(),
            name,
        };
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    }, []);

    const updateCategory = useCallback((id: string, name: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    }, []);

    const deleteCategory = useCallback((id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    }, []);

    return { categories, setCategories, addCategory, updateCategory, deleteCategory };
}

    