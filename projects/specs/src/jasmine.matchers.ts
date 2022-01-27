declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        interface Matchers<T> {
            toContainTimes: (expected: T, times: number) => boolean;
        }
    }
}

export const customMatchers = {
    toContainTimes: (util: jasmine.MatchersUtil): jasmine.CustomMatcher => ({
        compare: (actual: string | string[], expected: string, times = 0): jasmine.CustomMatcherResult => {
            let count = 0;
            if (typeof actual === 'string') {
                count = (actual.match(new RegExp(expected, 'g')) || []).length;
            } else if (Array.isArray(actual)) {
                actual.forEach(item => {
                    if (item === expected) {
                        count++;
                    }
                });
            }
            return {
                pass: (count === times),
                message: `Expect ${util.pp(actual)} (not) to contains "${expected}" more than (${times}) times.`
            };
        }
    })
};
