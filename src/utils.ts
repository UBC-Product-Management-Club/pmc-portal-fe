import { UserDocument } from './types/User';
import { Question } from './types/Question';
import { z } from 'zod/v4';
import { toast } from 'react-hot-toast';
import moment from 'moment-timezone';

const HEIST_START = new Date('2025-11-29T10:00:00').getTime();
const HEIST_END = new Date('2025-11-30T10:00:00').getTime();

const emptyUser: UserDocument = {
    userId: '',
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    university: 'University of British Columbia',
    pfp: '',
    pronouns: '',
    whyPm: '',
    isPaymentVerified: false,
};

function useInAppBrowser() {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    const isMobile = isIOS || isAndroid;
    const isInAppBrowser =
        ua.includes('wv') || // Android WebView
        (isIOS && !ua.includes('safari')) || // iOS WebView
        ua.includes('fbav') || // Facebook
        ua.includes('instagram') || // Instagram
        ua.includes('twitter') || // X (formerly Twitter)
        ua.includes('x-client') || // X's new client identifier
        ua.includes('linkedin'); // LinkedIn

    return { isInAppBrowser, isMobile };
}

const formatPrice = (price: number) => {
    return `$${price / 100}`;
};

function buildEventFormResponseSchema(questions: Question[]) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
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
                fieldSchema = fieldSchema.min(1, {
                    message: `This field is required.`,
                });
            }

            if (q.type === 'dropdown' && q.options) {
                fieldSchema = fieldSchema.refine((val) => q.options!.includes(val), {
                    message: `Selection is invalid.`,
                });
            }
        }
        shape[q.id] = fieldSchema;
    }
    return z.object(shape);
}

const showToast = (type: 'success' | 'error', message: string, duration: number = 4000) => {
    const options = {
        style: {
            borderRadius: '10px',
            background: '#ffffffff',
            color: '#000000ff',
        },
        duration: duration,
    };

    if (type === 'success') {
        toast.success(message, options);
    } else if (type === 'error') {
        toast.error(message, options);
    }
};

const renderTime = (start: string, end: string) => {
    const startTime = moment.utc(start).tz('America/Vancouver');
    const endTime = moment.utc(end).tz('America/Vancouver');
    if (startTime.isSame(endTime, 'day')) {
        return `${startTime.format('h:mm A')} - ${endTime.format('h:mm A')}`;
    } else {
        return `${startTime.format('MMMM D, h:mm A')} - ${endTime.format('MMMM D, h:mm A')}`;
    }
};

const renderDate = (start: string, end: string) => {
    const startTime = moment.utc(start).tz('America/Vancouver');
    const endTime = moment.utc(end).tz('America/Vancouver');

    if (startTime.isSame(endTime, 'day')) {
        return startTime.format('MMMM D, YYYY');
    }

    return `${startTime.format('MMMM')} ${startTime.format('D')} - ${endTime.format('D')}, ${startTime.format('YYYY')}`;
};

export {
    useInAppBrowser,
    emptyUser,
    formatPrice,
    buildEventFormResponseSchema,
    showToast,
    renderTime,
    renderDate,
    HEIST_START,
    HEIST_END,
};
