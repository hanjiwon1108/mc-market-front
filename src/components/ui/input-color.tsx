import { Button, ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type InputColorProps = Omit<ButtonProps, 'value'> & {
  value: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
};

export const InputColor = React.forwardRef<HTMLButtonElement, InputColorProps>(
  ({ value, onValueChange, ...props }, ref) => {
    const presets = [
      'white',
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'black',
      'lightgray',
      'darkgray',
      'darkorange',
      'lime',
      'lightgreen',
      'lightblue',
      'darkblue',
      'magenta',
    ];

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            {...props}
            className={cn(
              'justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              props.className,
            )}
          >
            <div className="flex w-full items-center gap-2">
              {value ? (
                <div
                  className="size-5 rounded border !bg-cover !bg-center transition-all"
                  style={{ background: value }}
                ></div>
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              <div className="flex-1 truncate">
                {value ? value : '색상 선택'}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="preset">
                프리셋
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="custom">
                커스텀
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="flex flex-wrap gap-1">
              {presets.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="h-6 w-6 cursor-pointer rounded-md border active:scale-105"
                  onClick={() => onValueChange(s)}
                />
              ))}
            </TabsContent>

            <TabsContent value="custom">
              <Label htmlFor="hex">HEX 색상</Label>
              <Input
                id="hex"
                className="col-span-2 h-8"
                placeholder="#000000"
                value={value?.startsWith('#') ? value : '#000000'}
                onValueChange={(v) => onValueChange(v)}
              />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    );
  },
);

InputColor.displayName = 'InputColor';
