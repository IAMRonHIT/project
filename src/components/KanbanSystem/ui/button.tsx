import * as React from "react"
import { cn } from "../../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50",
          
          // Variants
          variant === 'default' && "bg-cyan-600 text-white hover:bg-cyan-700",
          variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700",
          variant === 'outline' && "border border-cyan-900/30 text-cyan-400 hover:bg-cyan-900/20",
          variant === 'ghost' && "text-cyan-400 hover:bg-cyan-900/20",
          variant === 'link' && "text-cyan-400 underline-offset-4 hover:underline",
          
          // Sizes
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-8 rounded-md px-3 text-xs",
          size === 'lg' && "h-12 rounded-md px-6",
          size === 'icon' && "h-10 w-10",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }