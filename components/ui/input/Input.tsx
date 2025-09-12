"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, forwardRef, InputHTMLAttributes } from "react";

// 1. Define the props interface for the component.
// We extend InputHTMLAttributes to inherit all standard HTML <input> properties like `id`, `placeholder`, etc.
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onValueChange?: (value: string) => void;
  requiredSign?: boolean;
}

// 2. Type the forwardRef function.
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      onValueChange,
      onChange,
      value,
      defaultValue,
      requiredSign = false,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // 3. Type the useState hook.
    // The state can be a string, or an empty string, so 'string' is the correct type.
    const [inputValue, setInputValue] = useState<string>(
      (value as string) || (defaultValue as string) || ""
    );

    useEffect(() => {
      // 4. Ensure `value` and `inputValue` are handled correctly
      // by casting `value` to `string` if it is not undefined.
      if (value !== undefined && String(value) !== inputValue) {
        setInputValue(String(value));
      }
    }, [value, inputValue]);

    // 5. Explicitly type the event object
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(e);
      onValueChange?.(newValue);
    };

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            className={cn(
              "text-sm font-medium dark:font-[350] text-gray-700 dark:text-gray-100"
            )}
          >
            {label}
            {(required || requiredSign) && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {startIcon && (
            <div
              className={cn(
                "absolute left-3 flex items-center pointer-events-none text-gray-500"
              )}
            >
              <span className="pointer-events-auto">{startIcon}</span>
            </div>
          )}

          <input
            type={type}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input dark:border-primary/50 dark:font-[350] bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed ",
              startIcon && "pl-10",
              endIcon && "pr-10",
              error && "border-red-500",
              className
            )}
            value={inputValue}
            onChange={handleChange}
            ref={ref}
            min={type === "number" ? 0 : undefined}
            required={required}
            {...props}
          />

          {endIcon && (
            <div
              className={cn(
                "absolute right-3 flex items-center pointer-events-none text-gray-500"
              )}
            >
              <span className="pointer-events-auto">{endIcon}</span>
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className={cn("text-xs text-gray-500 dark:text-gray-400")}>
            {helperText}
          </p>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
