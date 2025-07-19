import React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105",
  {
    variants: {
      variant: {
        primary: "bg-[#FF0000] hover:bg-black text-white border border-white",
        secondary: "bg-gray-800 text-white border-2 border-gray-600 hover:border-white hover:text-white hover:bg-black",
        outline: "border-2 border-white text-white bg-transparent hover:bg-[#FF0000] hover:text-white",
        ghost: "text-white hover:text-[#FF0000] hover:scale-110",
        text: "text-[#FF0000] hover:text-red-400 bg-transparent hover:scale-105"
      },
      size: {
        sm: "h-8 px-3 text-sm rounded gap-1.5",
        md: "h-10 px-4 py-2 text-base rounded-lg gap-2",
        lg: "h-12 px-6 py-3 text-lg rounded-lg gap-2.5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

/**
 * Componente Button reutilizable y flexible
 * 
 * @example
 * // Botón básico
 * <Button text="Hacer clic" onClick={handleClick} />
 * 
 * @example
 * // Con ícono antes
 * <Button 
 *   text="Agregar al carrito" 
 *   iconBefore={<ShoppingCart size={18} />}
 *   onClick={handleAddToCart}
 * />
 * 
 * @example
 * // Variantes y tamaños
 * <Button variant="secondary" size="lg" text="Botón grande" />
 * <Button variant="outline" size="sm" text="Botón pequeño" />
 * <Button variant="ghost" text="Botón fantasma" />
 * <Button variant="text" text="Solo texto" />
 * 
 * @example
 * // Con estado de carga
 * <Button text="Guardando..." isLoading={saving} disabled={saving} />
 * 
 * @example
 * // Ancho completo con clases extras
 * <Button 
 *   text="Enviar formulario"
 *   fullWidth
 *   className="mt-4 shadow-lg"
 * />
 */
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  text?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      text,
      iconBefore,
      iconAfter,
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const content = children || text;
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Ícono antes del texto */}
        {iconBefore && !isLoading && (
          <span className="flex-shrink-0 flex items-center">
            {iconBefore}
          </span>
        )}

        {/* Spinner de carga */}
        {isLoading && (
          <span className="flex-shrink-0 flex items-center">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}

        {/* Contenido del botón */}
        {content && (
          <span className="flex items-center">
            {content}
          </span>
        )}

        {/* Ícono después del texto */}
        {iconAfter && !isLoading && (
          <span className="flex-shrink-0 flex items-center">
            {iconAfter}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps }; 