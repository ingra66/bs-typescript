import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    // Ignoramos asChild, solo renderizamos un botón simple
    return <button ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button }; 