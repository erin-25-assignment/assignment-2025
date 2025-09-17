"use client";

import { useState, useEffect } from 'react';
import type { MyLinkedList } from '@/lib/data-structures/linked-list';
import { MyLinkedList as LinkedList } from '@/lib/data-structures/linked-list';
import LinkedListControls from '@/components/linked-list-controls';
import LinkedListDisplay from '@/components/linked-list-display';
import { Code2 } from 'lucide-react';

export default function Home() {
  const [list, setList] = useState<MyLinkedList<string>>(new LinkedList());

  const fetchList = async () => {
    try {
      const response = await fetch('/api/list');
      if (!response.ok) {
        throw new Error('Failed to fetch list data.');
      }
      const data = await response.json();
      const newList = new LinkedList(data.data || []);
      setList(newList);
    } catch (error) {
      console.error("Failed to fetch list:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleUpdate = () => {
    fetchList();
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Code2 className="w-5 h-5" />
            <span className="font-semibold">자료 구조 놀이터</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            LinkedList
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            연결 리스트와 상호작용하고 스택 및 큐 구현을 탐색해보세요.
          </p>
        </header>

        <div className="space-y-8">
          <LinkedListDisplay list={list} />
          <LinkedListControls onUpdate={handleUpdate} />
        </div>
        
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>@2025.09. LinkedList</p>
        </footer>
      </div>
    </main>
  );
}
