import React from "react";
import clsx from "clsx";

const Card = ({ children, className, glass = false }) => {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-card text-card-foreground shadow-soft transition-all",
        glass && "glass",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={clsx("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={clsx("text-2xl font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={clsx("p-6 pt-0", className)}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={clsx("flex items-center p-6 pt-0", className)}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
