import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'lib',
        include: [
            '**/*.spec.ts',
        ],
        setupFiles: [
            'vitest.setup.ts',
        ],
    },
});
