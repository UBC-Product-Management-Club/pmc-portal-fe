import { describe, expect, it } from 'vitest';
import { ApiError } from '../../service/RestClient';
import { applicationErrorMessage, paymentErrorMessage } from './eventErrors';

const withCode = (code: string) => new ApiError('error', 409, code);

describe('event error messages', () => {
    it.each(['EVENT_FULL', 'CLOSED', 'NOT_OPEN', 'ALREADY_APPLIED'])(
        'has its own application message for %s',
        (code) => {
            expect(applicationErrorMessage(withCode(code))).not.toContain("Couldn't submit");
        }
    );

    it.each(['HOLD_EXPIRED', 'NOT_ACCEPTED', 'ALREADY_REGISTERED', 'PAYMENT_PROCESSING'])(
        'has its own payment message for %s',
        (code) => {
            expect(paymentErrorMessage(withCode(code))).not.toContain("Couldn't start");
        }
    );

    it('falls back for anything else', () => {
        expect(applicationErrorMessage(new Error('boom'))).toContain("Couldn't submit");
        expect(paymentErrorMessage(withCode('SOMETHING_NEW'))).toContain("Couldn't start");
    });
});
