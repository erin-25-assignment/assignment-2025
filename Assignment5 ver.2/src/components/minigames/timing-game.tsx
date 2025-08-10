"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TimingGameProps {
  requiredClicks?: number;
  timeLimit?: number;
  prompt: string;
  onSuccess: () => void;
  onFail: () => void;
}

export default function TimingGame({ requiredClicks = 10, timeLimit = 5000, prompt, onSuccess, onFail }: TimingGameProps) {
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [status, setStatus] = useState<'playing' | 'success' | 'fail'>('playing');

  const handleSuccess = useCallback(() => {
    if (status === 'playing') {
      setStatus('success');
      onSuccess();
    }
  }, [status, onSuccess]);
  
  const handleFail = useCallback(() => {
      if (status === 'playing') {
        setStatus('fail');
        onFail();
      }
  }, [status, onFail]);


  useEffect(() => {
    if (status !== 'playing') return;

    if (clickCount >= requiredClicks) {
        handleSuccess();
        return;
    }

    if (timeLeft <= 0) {
        handleFail();
        return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 100);
    }, 100);

    return () => clearTimeout(timer);
  }, [clickCount, timeLeft, status, requiredClicks, handleSuccess, handleFail]);

  const handleClick = () => {
    if (status === 'playing') {
      setClickCount(c => c + 1);
    }
  };

  const progress = (timeLeft / timeLimit) * 100;

  return (
    <Card className="w-full max-w-md text-center">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Test of Reflexes</CardTitle>
            <CardDescription>{prompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Progress value={progress} />
            <p className="text-lg font-semibold">Clicks: {clickCount} / {requiredClicks}</p>
            
            {status === 'playing' && (
                <Button onClick={handleClick} className="w-full h-24 text-2xl font-bold" variant="default">
                    Click!
                </Button>
            )}
            {status === 'success' && <p className="text-lg font-bold text-primary">Success!</p>}
            {status === 'fail' && <p className="text-lg font-bold text-destructive">Too slow!</p>}
        </CardContent>
    </Card>
  );
}
