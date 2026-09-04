/**
 * Security-focused tests for validation utilities
 * Tests input validation, XSS prevention, and edge cases
 */

import { describe, it, expect } from 'vitest';
import {
  validateString,
  validateCollectionName,
  validateTopicTitle,
  validateNotes,
  validatePasteText,
  sanitizeInput,
  validateNotEmpty,
} from './validation';

describe('Validation Security Tests', () => {
  describe('XSS Prevention', () => {
    it('should reject script tags', () => {
      const result = validateString('<script>alert("xss")</script>', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject javascript: protocol', () => {
      const result = validateString('javascript:alert("xss")', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject onerror handlers', () => {
      const result = validateString('<img onerror="alert(1)">', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject iframe tags', () => {
      const result = validateString('<iframe src="evil.com"></iframe>', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject object tags', () => {
      const result = validateString('<object data="evil.swf"></object>', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject embed tags', () => {
      const result = validateString('<embed src="evil.swf">', { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should accept safe HTML-like content', () => {
      const result = validateString('Discuss < and > operators', { maxLength: 100 });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Input Length Validation', () => {
    it('should reject extremely long inputs', () => {
      const longInput = 'a'.repeat(10001);
      const result = validateString(longInput, { maxLength: 10000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceed');
    });

    it('should reject inputs exceeding maxLength', () => {
      const result = validateString('a'.repeat(101), { maxLength: 100 });
      expect(result.isValid).toBe(false);
    });

    it('should reject inputs below minLength', () => {
      const result = validateString('ab', { minLength: 3, maxLength: 100 });
      expect(result.isValid).toBe(false);
    });

    it('should accept inputs within bounds', () => {
      const result = validateString('valid input', { minLength: 1, maxLength: 100 });
      expect(result.isValid).toBe(true);
    });

    it('should trim whitespace by default', () => {
      const result = validateString('  valid input  ', { maxLength: 100 });
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('valid input');
    });
  });

  describe('Specific Validators', () => {
    it('validateCollectionName should reject invalid characters', () => {
      const result = validateCollectionName('Test<script>alert(1)</script>');
      expect(result.isValid).toBe(false);
    });

    it('validateCollectionName should accept valid names', () => {
      const result = validateCollectionName('Distributed Systems Exam');
      expect(result.isValid).toBe(true);
    });

    it('validateTopicTitle should reject XSS', () => {
      const result = validateTopicTitle('<img src=x onerror=alert(1)>');
      expect(result.isValid).toBe(false);
    });

    it('validateTopicTitle should accept valid titles', () => {
      const result = validateTopicTitle('Paxos Consensus Algorithm');
      expect(result.isValid).toBe(true);
    });

    it('validateNotes should allow empty input', () => {
      const result = validateNotes('');
      expect(result.isValid).toBe(true);
    });

    it('validateNotes should reject XSS', () => {
      const result = validateNotes('<script>alert(1)</script>');
      expect(result.isValid).toBe(false);
    });

    it('validatePasteText should handle large inputs', () => {
      const largeInput = 'Topic\n'.repeat(2000);
      const result = validatePasteText(largeInput);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Sanitization', () => {
    it('sanitizeInput should remove angle brackets', () => {
      const result = sanitizeInput('<test>content</test>');
      expect(result).toBe('testcontent');
    });

    it('sanitizeInput should trim whitespace', () => {
      const result = sanitizeInput('  content  ');
      expect(result).toBe('content');
    });

    it('validateNotEmpty should reject empty strings', () => {
      const result = validateNotEmpty('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('validateNotEmpty should reject whitespace-only strings', () => {
      const result = validateNotEmpty('   ');
      expect(result.isValid).toBe(false);
    });

    it('validateNotEmpty should accept non-empty strings', () => {
      const result = validateNotEmpty('valid');
      expect(result.isValid).toBe(true);
    });
  });
});
