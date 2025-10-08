import type React from "react";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface StatefulButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "active" | "inactive";
  children: React.ReactNode;
}

const StatefulButton = forwardRef<HTMLButtonElement, StatefulButtonProps>(
  ({ className, variant = "active", children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-200",
          {
            "bg-blue-600 hover:bg-blue-700 active:bg-blue-800":
              variant === "active" && !disabled,
            "bg-blue-300 text-white cursor-not-allowed":
              variant === "inactive" || disabled,
          },
          className
        )}
        ref={ref}
        disabled={variant === "inactive" || disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

StatefulButton.displayName = "StatefulButton";

export { StatefulButton };
