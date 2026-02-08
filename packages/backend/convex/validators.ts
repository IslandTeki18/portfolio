import { isValidSlug } from "@repo/lib/slug";

/**
 * Validates that a slug string is in valid kebab-case format.
 * Throws a user-facing error if invalid.
 */
export function validateSlugFormat(slug: string): void {
  if (!isValidSlug(slug)) {
    throw new Error(
      `Invalid slug format: "${slug}". Slugs must be lowercase alphanumeric with single hyphens, and cannot start or end with a hyphen.`,
    );
  }
}

/**
 * Validates that all required project fields are present and non-empty.
 * Throws a user-facing error if any required field is missing.
 */
export function validateProjectRequired(data: {
  title?: string;
  slug?: string;
  shortDescription?: string;
}): void {
  if (!data.title?.trim()) {
    throw new Error("Project title is required.");
  }
  if (!data.slug?.trim()) {
    throw new Error("Project slug is required.");
  }
  if (!data.shortDescription?.trim()) {
    throw new Error("Project short description is required.");
  }
}

/**
 * Validates that all required business fields are present and non-empty.
 * Throws a user-facing error if any required field is missing.
 */
export function validateBusinessRequired(data: {
  name?: string;
  slug?: string;
  shortDescription?: string;
}): void {
  if (!data.name?.trim()) {
    throw new Error("Business name is required.");
  }
  if (!data.slug?.trim()) {
    throw new Error("Business slug is required.");
  }
  if (!data.shortDescription?.trim()) {
    throw new Error("Business short description is required.");
  }
}

// Slug uniqueness must be enforced at the mutation level via a db query
// against the relevant table's by_slug index before inserting or updating.
