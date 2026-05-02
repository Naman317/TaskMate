import React from "react";
import clsx from "clsx";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export default Skeleton;
