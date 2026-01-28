import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Potentially unsafe HTML string
 * @returns Sanitized safe HTML string
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [], // Remove all HTML tags
        ALLOWED_ATTR: [], // Remove all attributes
        KEEP_CONTENT: true, // Keep text content
    });
}

/**
 * Sanitize user input text (removes HTML but preserves line breaks)
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string | null | undefined): string | null {
    if (!input) return null;

    // Remove HTML tags but preserve text content
    return sanitizeHtml(input).trim();
}
