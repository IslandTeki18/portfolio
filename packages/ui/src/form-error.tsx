import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/utils";

export interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  errors?: Array<{ id: string; message: string }> | string[];
}

export const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
  ({ message, errors, className, ...props }, ref) => {
    if (!message && (!errors || errors.length === 0)) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-3 rounded-md bg-control-critical-fill border border-control-critical-label/30",
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-control-critical-label"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            {message && (
              <p className="text-sm font-medium text-control-critical-label">
                {message}
              </p>
            )}
            {errors && errors.length > 0 && (
              <ul className="mt-2 text-sm text-control-critical-label list-disc list-inside space-y-1">
                {errors.map((error) => {
                  const key = typeof error === "string" ? error : error.id;
                  const msg = typeof error === "string" ? error : error.message;
                  return <li key={key}>{msg}</li>;
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FormError.displayName = "FormError";

export interface FormSuccessProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

export const FormSuccess = forwardRef<HTMLDivElement, FormSuccessProps>(
  ({ message, className, ...props }, ref) => {
    if (!message) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-3 rounded-md bg-control-positive-fill border border-control-positive-label/30",
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-control-positive-label"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-control-positive-label">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

FormSuccess.displayName = "FormSuccess";
