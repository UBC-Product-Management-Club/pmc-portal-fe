import { z } from 'zod/v4';

const baseQuestionSchema = z.object({
    id: z.string(),
    label: z.string(),
    required: z.boolean(),
});

const shortAnsQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('short-answer'),
});

const longAnsQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('long-answer'),
    maxWords: z.number().optional(),
});

const dropdownQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('dropdown'),
    options: z.array(z.string()),
});

const fileQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('file'),
    accept: z.array(z.string()).optional(),
    maxSizeMB: z.number().optional(),
});

const questionSchema = z.discriminatedUnion('type', [
    shortAnsQuestionSchema,
    longAnsQuestionSchema,
    dropdownQuestionSchema,
    fileQuestionSchema,
]);

type Question = z.infer<typeof questionSchema>;

export type { Question };
export const questionsSchema = z.array(questionSchema);

// Events store their questions as { questions: [...] }; a bare list also works
export function parseQuestions(raw: unknown): Question[] {
    const list = raw && typeof raw === 'object' && 'questions' in raw ? raw.questions : raw;
    const result = questionsSchema.safeParse(list);
    return result.success ? result.data : [];
}
