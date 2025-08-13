import { UserDocument } from './types/User';
import { Question } from './types/Question';
import { z } from 'zod/v4';

const emptyUser: UserDocument = {
    id: '',
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    university: 'University of British Columbia',
    pfp: '',
    pronouns: '',
    whyPm: '',
};

function isInAppBrowser() {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    return (
        ua.includes('wv') || // Android WebView
        (isIOS && !ua.includes('safari')) || // iOS WebView
        ua.includes('fbav') || // Facebook
        ua.includes('instagram') || // Instagram
        ua.includes('twitter') || // X (formerly Twitter)
        ua.includes('x-client') || // X's new client identifier
        ua.includes('linkedin') // LinkedIn
    );
}

function formatPrice(price: number) {
    return `$${price / 100}`;
}

function buildEventFormResponseSchema(questions: Question[]) {
    const shape: Record<string, z.ZodType<any>> = {};
    // Dynamically generate schema for each question's input
    for (const q of questions) {
        let fieldSchema;
        if (q.type === 'file') {
            fieldSchema = z.instanceof(File);
            if (!q.required) fieldSchema = fieldSchema.optional();
        } else {
            fieldSchema = z.string();

            if (q.required) {
                fieldSchema = fieldSchema.min(1, {message: `${q.label} is cannot be left empty.`});
            } 

            if (q.type === 'dropdown' && q.options) {
                fieldSchema = fieldSchema.refine((val) => q.options!.includes(val), {message: `Invalid selection for ${q.label}`});
            }
        }
        shape[q.id] = fieldSchema;
    };
    return z.object(shape);
};

export { isInAppBrowser, emptyUser, formatPrice, buildEventFormResponseSchema};
