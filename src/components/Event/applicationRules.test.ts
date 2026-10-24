import { describe, expect, it } from 'vitest';
import { Question } from '../../types/Question';
import { checkFile, checkLink, countWords } from './applicationRules';

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

describe('checkLink', () => {
    it('needs a full https link', () => {
        expect(checkLink('https://youtu.be/x', true)).toBeUndefined();
        expect(checkLink('youtube.com/watch?v=x', true)).toMatch(/https:\/\//);
        expect(checkLink('javascript:alert(1)', true)).toMatch(/https:\/\//);
        expect(checkLink('', false)).toBeUndefined();
    });

    it('allows 2,048 characters and rejects 2,049', () => {
        const base = 'https://example.com/';
        expect(checkLink(base + 'a'.repeat(2048 - base.length), true)).toBeUndefined();
        expect(checkLink(base + 'a'.repeat(2049 - base.length), true)).toMatch(/2,048/);
    });
});
