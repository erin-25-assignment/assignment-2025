
'use client';

import { MyLinkedList } from "@/lib/data-structures/linked-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface LinkedListDisplayProps {
  list: MyLinkedList<string>;
}

export default function LinkedListDisplay({ list }: LinkedListDisplayProps) {
  const nodes = list.toArray();

  return (
    <Card>
      <CardHeader>
        <CardTitle>현재 연결 리스트</CardTitle>
      </CardHeader>
      <CardContent>
        {list.size === 0 ? (
          <p className="text-muted-foreground italic">리스트가 비어 있습니다.</p>
        ) : (
          <div className="flex items-center flex-wrap gap-2 text-sm sm:text-base">
            {nodes.map((node, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="bg-primary/10 border-2 border-primary/20 text-primary-foreground rounded-lg flex items-center justify-center min-w-[40px] h-10 px-3 shadow-md">
                   <span className="font-mono font-bold text-primary">{node}</span>
                </div>
                {index < nodes.length - 1 && <ArrowRight className="text-muted-foreground" />}
              </div>
            ))}
             <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground font-bold">null</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
