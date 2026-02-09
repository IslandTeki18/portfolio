import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "./lib/utils";
import {
  generateFormId,
  getAriaDescribedBy,
  formInputBaseStyles,
  formInputNormalStyles,
  formInputErrorStyles,
  formLabelStyles,
  formErrorStyles,
  formHelperStyles,
} from "./lib/form-utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      id,
      children,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = generateFormId(id, label);
    const hasError = Boolean(error);

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={selectId} className={formLabelStyles}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            formInputBaseStyles,
            hasError ? formInputErrorStyles : formInputNormalStyles,
            fullWidth && "w-full",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={getAriaDescribedBy(selectId, error, helperText)}
          required={required}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p id={`${selectId}-error`} className={formErrorStyles}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className={formHelperStyles}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
