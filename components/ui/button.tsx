import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6000] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-[#FF6000] text-white hover:bg-[#FF5500] shadow-md hover:shadow-lg active:scale-[0.98] font-bold",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:scale-[0.98]",
        outline:
          "border-2 border-gray-300 bg-white hover:border-[#FF6000] hover:bg-[#FFF4E6] text-gray-700 hover:text-[#FF6000] shadow-sm hover:shadow-md active:scale-[0.98]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md active:scale-[0.98]",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]",
        link: "text-[#FF6000] underline-offset-4 hover:underline hover:text-[#FF5500] font-semibold",
        premium: "bg-[#FF6000] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] font-bold",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-lg text-base",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-lg px-8 text-lg",
        xl: "h-16 rounded-lg px-10 text-xl",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={props['aria-label'] || (typeof props.children === 'string' ? props.children : undefined)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

