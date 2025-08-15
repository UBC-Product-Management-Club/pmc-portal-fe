import { z } from 'zod/v4';

const baseQuestionSchema = z.object({
    id: z.string(),
    label: z.string(),
    required: z.boolean()
});

const shortAnsQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('short-answer'),
});

const longAnsQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('long-answer'),
});

const dropdownQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('dropdown'),
    options: z.array(z.string()),
});

const fileQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('file'),
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


