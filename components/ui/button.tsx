import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#FF7A00] to-[#FF8A00] text-white hover:from-[#FF8A00] hover:to-[#FF9A00] shadow-lg hover:shadow-xl active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl active:scale-95",
        outline:
          "border-2 border-slate-300 bg-white hover:border-orange-400 hover:bg-orange-50 text-slate-700 hover:text-orange-700 shadow-sm hover:shadow-md active:scale-95",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg active:scale-95",
        ghost: "hover:bg-slate-100 hover:text-slate-900 active:scale-95",
        link: "text-orange-600 underline-offset-4 hover:underline hover:text-orange-700",
        premium: "bg-gradient-to-r from-[#FF7A00] via-[#FF8A00] to-[#FF7A00] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 bg-size-200 bg-pos-0 hover:bg-pos-100",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-xl",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11 rounded-xl",
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
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

