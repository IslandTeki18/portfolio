import { TextareaHTMLAttributes, forwardRef } from "react";
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

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const textareaId = generateFormId(id, label);
    const hasError = Boolean(error);

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={textareaId} className={formLabelStyles}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            formInputBaseStyles,
            hasError ? formInputErrorStyles : formInputNormalStyles,
            fullWidth && "w-full",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={getAriaDescribedBy(textareaId, error, helperText)}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={formErrorStyles}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className={formHelperStyles}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
