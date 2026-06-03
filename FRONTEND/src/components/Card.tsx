import React from "react";
export const cn = (...classes: (string | boolean)[]) =>
  classes.filter(Boolean).join(" ");

const Card = ({
  children,
  className = "",
  hoverable = false,
  ...props
}: {
  children: React.ReactNode;
  className: string;
  hoverable: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-sm",
        hoverable && "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
