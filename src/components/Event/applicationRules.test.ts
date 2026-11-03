import { describe, expect, it } from 'vitest';
import { Question } from '../../types/Question';
import { checkEmail, checkFile, checkLink, checkPhone, countWords } from './applicationRules';

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

describe('checkEmail', () => {
    it('accepts a normal address and rejects malformed ones', () => {
        expect(checkEmail('you@example.com')).toBeUndefined();
        expect(checkEmail('')).toBe('Please enter your email.');
        expect(checkEmail('you@example')).toBeDefined();
        expect(checkEmail('you example.com')).toBeDefined();
    });
});

describe('checkPhone', () => {
    it('accepts common North American formats', () => {
        for (const phone of ['604-555-0123', '(604) 555-0123', '6045550123', '+1 604 555 0123']) {
            expect(checkPhone(phone, true)).toBeUndefined();
        }
    });

    it('rejects short or lettered numbers and respects optional', () => {
        expect(checkPhone('555-0123', true)).toBeDefined();
        expect(checkPhone('604-555-01ab', true)).toBeDefined();
        expect(checkPhone('', true)).toBe('Please enter your phone number.');
        expect(checkPhone('', false)).toBeUndefined();
    });
});
