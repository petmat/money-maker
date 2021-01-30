import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={clsx(
      " text-gray-200 bg-gray-600 py-1 px-2 rounded-md",
      className
    )}
  />
);
export default Button;
