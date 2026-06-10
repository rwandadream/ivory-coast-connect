"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface MoneyInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "type" | "onChange" | "value"
> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  error?: boolean;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value);

const parseMoney = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits);
};

const clampValue = (value: number, min?: number, max?: number) => {
  let result = value;
  if (typeof min === "number") {
    result = Math.max(min, result);
  }
  if (typeof max === "number") {
    result = Math.min(max, result);
  }
  return result;
};

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    { className, value, onValueChange, min = 0, max, placeholder, disabled, required, ...props },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>(
      value > 0 ? formatMoney(value) : "",
    );
    const [focused, setFocused] = React.useState(false);

    React.useEffect(() => {
      if (!focused) {
        setDisplayValue(value > 0 ? formatMoney(value) : "");
      }
    }, [value, focused]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      const parsed = parseMoney(raw);
      const clamped = clampValue(parsed, min, max);
      setDisplayValue(clamped > 0 ? formatMoney(clamped) : raw.replace(/\D/g, ""));
      onValueChange(clamped);
    };

    const handleBlur = () => {
      setFocused(false);
      setDisplayValue(value > 0 ? formatMoney(clampValue(value, min, max)) : "");
    };

    const handleFocus = () => {
      setFocused(true);
      setDisplayValue(value > 0 ? String(value) : "");
    };

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={displayValue}
          placeholder={placeholder ?? "0"}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          className="pr-20"
          aria-invalid={disabled ? undefined : required && value <= 0}
          {...props}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          FCFA
        </span>
      </div>
    );
  },
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };
