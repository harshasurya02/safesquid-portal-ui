import type React from "react";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface StatefulButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "active" | "inactive" | "outline";
  children: React.ReactNode;
}

const StatefulButton = forwardRef<HTMLButtonElement, StatefulButtonProps>(
  ({ className, variant = "active", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={variant === "inactive" || disabled}
        className={cn(
          "w-full px-4 py-3 rounded-[4px] font-medium transition-all duration-200 cursor-pointer border border-transparent text-base",
          {
            // Active (solid)
            "bg-primary text-white hover:bg-blue-700 active:bg-blue-800":
              variant === "active" && !disabled,

            // Inactive / Disabled
            "bg-blue-300 text-white cursor-not-allowed":
              variant === "inactive" || disabled,

            // Outline variant
            "bg-transparent border border-primary text-primary hover:bg-primary/10 active:bg-primary/20":
              variant === "outline" && !disabled,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

StatefulButton.displayName = "StatefulButton";

export { StatefulButton };
