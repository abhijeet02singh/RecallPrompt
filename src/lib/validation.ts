/**
 * Validation utilities for user input
 * Provides centralized validation for all user-generated content
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Validates and sanitizes a string input
 */
export function validateString(
  input: string,
  options: {
    minLength?: number;
    maxLength: number;
    trim?: boolean;
  } = { maxLength: 1000 }
): ValidationResult {
  const { minLength = 0, maxLength, trim = true } = options;
  
  let value = input;
  if (trim) {
    value = value.trim();
  }
  
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `Input must be at least ${minLength} characters`,
    };
  }
  
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `Input must not exceed ${maxLength} characters`,
    };
  }
  
  // Check for potentially dangerous patterns (basic XSS prevention)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(value)) {
      return {
        isValid: false,
        error: 'Input contains potentially dangerous content',
      };
    }
  }
  
  return {
    isValid: true,
    sanitizedValue: value,
  };
}

/**
 * Validates a collection name
 */
export function validateCollectionName(input: string): ValidationResult {
  const result = validateString(input, {
    minLength: 1,
    maxLength: 100,
    trim: true,
  });
  
  if (!result.isValid) {
    return result;
  }
  
  // Additional collection-specific validation
  if (!/^[a-zA-Z0-9\s\-_.,!?']+$/.test(result.sanitizedValue!)) {
    return {
      isValid: false,
      error: 'Collection name contains invalid characters',
    };
  }
  
  return result;
}

/**
 * Validates a topic title
 */
export function validateTopicTitle(input: string): ValidationResult {
  const result = validateString(input, {
    minLength: 1,
    maxLength: 200,
    trim: true,
  });
  
  if (!result.isValid) {
    return result;
  }
  
  return result;
}

/**
 * Validates reflection notes or blind spot notes
 */
export function validateNotes(input: string): ValidationResult {
  return validateString(input, {
    minLength: 0,
    maxLength: 2000,
    trim: true,
  });
}

/**
 * Validates paste text for batch topic import
 */
export function validatePasteText(input: string): ValidationResult {
  return validateString(input, {
    minLength: 0,
    maxLength: 10000,
    trim: false,
  });
}

/**
 * Sanitizes input by removing potentially dangerous characters
 * This is a basic sanitization - for HTML content, use DOMPurify
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

/**
 * Validates that a value is not empty after trimming
 */
export function validateNotEmpty(input: string): ValidationResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'This field is required',
    };
  }
  return {
    isValid: true,
    sanitizedValue: trimmed,
  };
}
