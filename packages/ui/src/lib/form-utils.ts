/**
 * Generates an ID for form elements based on label or provided ID.
 * Converts labels to kebab-case for use as element IDs.
 *
 * @param id - Optional explicit ID
 * @param label - Optional label to derive ID from
 * @returns Generated or provided ID
 */
export function generateFormId(id?: string, label?: string): string | undefined {
  return id || label?.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Generates the aria-describedby attribute value for form elements.
 * Links form controls to their error or helper text for accessibility.
 *
 * @param id - The form element ID
 * @param error - Error message (if present)
 * @param helperText - Helper text (if present)
 * @returns aria-describedby value or undefined
 */
export function getAriaDescribedBy(
  id: string | undefined,
  error?: string,
  helperText?: string
): string | undefined {
  if (!id) return undefined;
  if (error) return `${id}-error`;
  if (helperText) return `${id}-helper`;
  return undefined;
}

/**
 * Common base styles for form input elements.
 * Includes padding, border, focus and disabled states. Colors come from theme tokens.
 */
export const formInputBaseStyles =
  "px-3 py-2.5 border rounded-md focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-background-secondary text-foreground";

/**
 * Styles for form inputs in normal (non-error) state.
 */
export const formInputNormalStyles =
  "border-input focus:border-primary focus:ring-primary";

/**
 * Styles for form inputs in error state.
 */
export const formInputErrorStyles =
  "border-destructive focus:border-destructive focus:ring-destructive";

/**
 * Common styles for form labels.
 */
export const formLabelStyles =
  "block text-[13px] font-medium text-muted-foreground mb-1.5";

/**
 * Common styles for error messages.
 */
export const formErrorStyles = "mt-1.5 text-xs text-destructive";

/**
 * Common styles for helper text.
 */
export const formHelperStyles = "mt-1.5 text-xs text-label-secondary";
