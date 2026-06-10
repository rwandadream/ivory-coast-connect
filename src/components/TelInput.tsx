import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TelInput({
  value,
  onChange,
  className,
  placeholder = "XX XX XX XX XX",
  id,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch overflow-hidden rounded-md border border-input bg-background",
        className,
      )}
    >
      <span className="flex items-center bg-muted px-3 text-sm font-medium text-muted-foreground">
        +225
      </span>
      <Input
        id={id}
        required={required}
        inputMode="tel"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d ]/g, "").slice(0, 14))}
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
