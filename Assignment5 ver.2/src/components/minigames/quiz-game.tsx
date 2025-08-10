"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizGameProps {
  question: string;
  options: string[];
  correctIndex: number;
  onSuccess: () => void;
  onFail: () => void;
}

export default function QuizGame({ question, options, correctIndex, onSuccess, onFail }: QuizGameProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkAnswer = () => {
    if (selectedValue === null) return;
    const selectedIndex = parseInt(selectedValue, 10);
    if (selectedIndex === correctIndex) {
      onSuccess();
    } else {
      onFail();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Quiz Challenge</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedValue}>
          <div className="space-y-2">
            {options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                <Label htmlFor={`option-${i}`} className="text-base font-normal">{option}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={checkAnswer} disabled={selectedValue === null} className="w-full">
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
}
