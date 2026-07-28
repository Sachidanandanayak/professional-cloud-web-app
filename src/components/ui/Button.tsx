import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, magnetic = true, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 text-white",
      outline: "border border-border/50 bg-transparent shadow-sm hover:bg-white/5 hover:text-white text-muted",
      ghost: "hover:bg-white/5 hover:text-white text-muted",
      glass: "bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
      danger: "bg-danger/20 text-danger border border-danger/20 hover:bg-danger/30 hover:text-red-400",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 py-2",
      lg: "h-10 px-8",
      icon: "h-9 w-9",
    };

    const Comp = magnetic ? motion.button : 'button';
    const motionProps = magnetic ? { whileTap: { scale: 0.95 } } : {};

    return (
      <Comp
        ref={ref as any}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(motionProps as any)}
        {...props}
        disabled={isLoading || props.disabled}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
