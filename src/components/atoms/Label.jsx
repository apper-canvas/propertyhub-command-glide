import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ 
  className, 
  children,
  required = false,
  ...props 
}, ref) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;