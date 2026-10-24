import { describe, expect, it } from 'vitest';
import { Question } from '../../types/Question';
import { checkFile, countWords } from './applicationRules';

const resume = {
    id: 'resume',
    type: 'file',
    label: 'Resume',
    required: true,
    accept: ['application/pdf'],
    maxSizeMB: 5,
} as Question;

const pdf = (bytes: number, name = 'resume.pdf', type = 'application/pdf') =>
    new File([new Uint8Array(bytes)], name, { type });

describe('countWords', () => {
    it('counts words across spaces and line breaks', () => {
        expect(countWords('')).toBe(0);
        expect(countWords('   ')).toBe(0);
        expect(countWords('one two\nthree   four')).toBe(4);
    });
});

describe('checkFile', () => {
    it('requires a file when the question is required', () => {
        expect(checkFile(resume, null)).toBe('Please upload a file.');
    });

    it('only accepts PDFs', () => {
        expect(checkFile(resume, pdf(10, 'resume.docx', 'application/msword'))).toBe(
            'Upload a PDF file.'
        );
    });

    it('allows exactly 5,000,000 bytes and rejects one byte over', () => {
        expect(checkFile(resume, pdf(5_000_000))).toBeUndefined();
        expect(checkFile(resume, pdf(5_000_001))).toMatch(/too large/);
    });
});
