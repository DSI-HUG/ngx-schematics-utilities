import hug from '@hug/eslint-config';
export default [
    ...(await hug.configs.moderate),
    hug.configs.stylistic,
    ...hug.overrides.typescript({
        '@typescript-eslint/no-unnecessary-condition': 'off',
        'rxjs-x/finnish': 'off',
        'jsdoc/require-returns-description': 'off',
        'jsdoc/no-defaults': 'off',
        'jsdoc/no-types': 'off',
        'jsdoc/require-param-type': 'warn',
        'jsdoc/require-returns-type': 'warn',
    }),
];
