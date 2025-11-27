"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithPresetsProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePickerWithPresets({
  date,
  onDateChange,
}: DatePickerWithPresetsProps) {
  const [open, setOpen] = React.useState(false);

  const presets = [
    {
      label: "Hari Ini",
      value: new Date(),
    },
    {
      label: "Kemarin",
      value: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      label: "7 Hari Lalu",
      value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const handlePresetClick = (presetDate: Date) => {
    onDateChange(presetDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-[280px]",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="end">
        <div className="space-y-1">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => handlePresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="border-t pt-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
                setOpen(false);
              }
            }}
            initialFocus
            locale={id}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}