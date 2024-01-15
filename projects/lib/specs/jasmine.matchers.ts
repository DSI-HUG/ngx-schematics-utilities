/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        interface Matchers<T> {
            toContainTimes: (expected: T | Record<any, any>, times: number) => boolean;
        }
    }
}

/**
 * @internal
 */
export const customMatchers = {
    toContainTimes: (util: jasmine.MatchersUtil): jasmine.CustomMatcher => ({
        compare: (actual: string | any[], expected: any, times = 0): jasmine.CustomMatcherResult => {
            let count = 0;
            if (typeof actual === 'string') {
                const preservedExpected = (expected as string).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                count = (actual.match(new RegExp(preservedExpected, 'g')) ?? []).length;
            } else if (Array.isArray(actual)) {
                actual.forEach(item => {
                    if (JSON.stringify(item) === JSON.stringify(expected)) {
                        count++;
                    }
                });
            }
            return {
                pass: (count === times),
                message: `Expect ${util.pp(actual)} (not) to contains "${expected as string}" more than (${times}) times.`
            };
        }
    })
};
