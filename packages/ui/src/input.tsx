import { InputHTMLAttributes, forwardRef } from "react";
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

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = generateFormId(id, label);
    const hasError = Boolean(error);

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={inputId} className={formLabelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            formInputBaseStyles,
            hasError ? formInputErrorStyles : formInputNormalStyles,
            fullWidth && "w-full",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={getAriaDescribedBy(inputId, error, helperText)}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className={formErrorStyles}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className={formHelperStyles}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
