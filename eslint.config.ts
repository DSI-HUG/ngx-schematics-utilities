import hug from '@hug/eslint-config';
import { defineConfig } from 'eslint/config';

const jsdocConfig = {
    rules: {
        'jsdoc/require-returns-description': 'off',
        'jsdoc/no-defaults': 'off',
        'jsdoc/no-types': 'off',
        'jsdoc/require-param-type': 'warn',
        'jsdoc/require-returns-type': 'warn',
    },
};

export default defineConfig(
    hug.configs.createModerate({
        typescript: {
            rules: {
                '@typescript-eslint/no-unnecessary-condition': 'off',
            },
        },
        rxjs: {
            rules: {
                'rxjs-x/finnish': 'off',
            },
        },
        jsdoc: {
            // @ts-expect-error Incompatible type
            js: jsdocConfig,
            // @ts-expect-error Incompatible type
            ts: jsdocConfig,
        },
    }),
    hug.configs.stylistic.recommended,
);
