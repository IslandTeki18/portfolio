import { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) => {
  const baseStyles = "rounded-lg";

  const variantStyles = {
    default: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    outline: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  };

  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ children, className = "", ...props }: CardHeaderProps) => {
  return (
    <div className={`mb-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = ({ children, as: Component = "h3", className = "", ...props }: CardTitleProps) => {
  return (
    <Component className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
};

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = ({ children, className = "", ...props }: CardContentProps) => {
  return (
    <div className={`text-gray-700 dark:text-gray-300 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({ children, className = "", ...props }: CardFooterProps) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
