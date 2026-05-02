import React, { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  ({ placeholder, label, type, name, error, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          className={clsx(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error ? "border-red-500 focus-visible:ring-red-500" : "hover:border-primary/50",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
