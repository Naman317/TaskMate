import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";

const Button = ({
  icon,
  className,
  label,
  type = "button",
  onClick = () => {},
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
}) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {label && <span>{label}</span>}
          {icon && <span className="text-lg">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
