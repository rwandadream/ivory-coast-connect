"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Choisir une date",
  className,
  required,
}: DatePickerProps) {
  const date = value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border-input bg-background",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: fr }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              onChange(format(d, "yyyy-MM-dd"));
            }
          }}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1940}
          toYear={new Date().getFullYear() + 10}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}
