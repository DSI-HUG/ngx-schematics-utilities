/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, type MatcherResult } from 'vitest';

declare module 'vitest' {
    interface Assertion {
        toContainTimes: (expected: string | Record<any, any>, times: number) => void;
    }
}

export const customMatchers = {
    toContainTimes: (received: string | any[], expected: any, times: number): MatcherResult => {
        let count = 0;
        if (typeof received === 'string') {
            const preservedExpected = String(expected).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            count = (received.match(new RegExp(preservedExpected, 'g')) ?? []).length;
        } else if (Array.isArray(received)) {
            count = received.reduce<number>((acc, item) =>
                (JSON.stringify(item)) === JSON.stringify(expected) ? acc + 1 : acc, 0,
            );
        }
        return {
            pass: count === times,
            message: () => `Expected "${JSON.stringify(received)}" to contain "${String(expected)}" ${times} time(s)`,
        };
    },
};

expect.extend(customMatchers);
