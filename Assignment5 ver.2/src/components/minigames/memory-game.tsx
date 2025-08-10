"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface MemoryGameProps {
  sequence: string;
  prompt: string;
  onSuccess: () => void;
  onFail: () => void;
}

export default function MemoryGame({ sequence = "1234", prompt, onSuccess, onFail }: MemoryGameProps) {
  const [showSequence, setShowSequence] = useState(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowSequence(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkInput = () => {
    if (input.trim().replace(/\s/g, '') === sequence.replace(/\s/g, '')) {
      onSuccess();
    } else {
      onFail();
    }
  };

  return (
     <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Memory Test</CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
      <CardContent>
        {showSequence ? (
          <div className="p-8 bg-muted rounded-lg">
            <p className="font-mono text-4xl font-bold tracking-widest">{sequence}</p>
          </div>
        ) : (
          <div className='space-y-4'>
            <p>Enter the sequence:</p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-2xl text-center font-mono tracking-widest"
              maxLength={sequence.length}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showSequence && (
          <Button onClick={checkInput} className="w-full">
            Check Memory
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
