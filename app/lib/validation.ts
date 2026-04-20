import { z } from 'zod';

// Resume Upload Form Validation
export const uploadResumeSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  jobTitle: z.string()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must not exceed 100 characters'),
  jobDescription: z.string()
    .min(1, 'Job description is required')
    .min(10, 'Job description must be at least 10 characters')
    .max(5000, 'Job description must not exceed 5000 characters'),
});

export type UploadResumeFormData = z.infer<typeof uploadResumeSchema>;

// File Validation
export const fileValidation = {
  maxSize: 20 * 1024 * 1024, // 20MB
  allowedMimeTypes: ['application/pdf'],
  allowedExtensions: ['.pdf'],
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > fileValidation.maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds 20MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
    };
  }

  if (!fileValidation.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  return { valid: true };
};
