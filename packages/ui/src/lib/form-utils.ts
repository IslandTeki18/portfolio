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
 * Includes padding, border, focus states, disabled states, and dark mode support.
 */
export const formInputBaseStyles =
  "px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

/**
 * Styles for form inputs in normal (non-error) state.
 */
export const formInputNormalStyles =
  "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500";

/**
 * Styles for form inputs in error state.
 */
export const formInputErrorStyles =
  "border-red-500 focus:border-red-500 focus:ring-red-500";

/**
 * Common styles for form labels.
 */
export const formLabelStyles =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

/**
 * Common styles for error messages.
 */
export const formErrorStyles = "mt-1 text-sm text-red-600 dark:text-red-400";

/**
 * Common styles for helper text.
 */
export const formHelperStyles = "mt-1 text-sm text-gray-500 dark:text-gray-400";
