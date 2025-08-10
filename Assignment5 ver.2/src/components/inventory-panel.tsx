"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { itemsData } from "@/lib/story";
import type { Inventory } from "@/lib/types";

interface InventoryPanelProps {
  inventory: Inventory;
}

export default function InventoryPanel({ inventory }: InventoryPanelProps) {
  const ownedItems = Object.keys(inventory).filter(key => inventory[key] && itemsData[key]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          {ownedItems.length > 0 ? (
            <ul className="space-y-3">
              {ownedItems.map(key => {
                const item = itemsData[key];
                if (!item) return null;
                return (
                  <li key={key} className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <item.icon className="h-6 w-6 text-primary" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">Your inventory is empty.</p>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
