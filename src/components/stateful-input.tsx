"use client";

import type React from "react";
import { useState, forwardRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatefulInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

const StatefulInput = forwardRef<HTMLInputElement, StatefulInputProps>(
  (
    {
      className,
      label,
      error,
      showClearButton,
      onClear,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;
    const hasError = !!error;

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex h-[48px] w-full rounded-md border px-[20px] py-[12px] text-sm transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Normal
              !isFocused && !hasError && "border-input bg-background",
              // Focused
              isFocused &&
                !hasError &&
                "border-[1px] border-solid border-primary bg-background",
              // Error
              hasError &&
                "border-[1px] border-solid border-red-500 bg-background",
              // Extra padding for clear button
              showClearButton && hasValue && "pr-10",
              className
            )}
            {...props}
          />
          {showClearButton && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

StatefulInput.displayName = "StatefulInput";

export { StatefulInput };
