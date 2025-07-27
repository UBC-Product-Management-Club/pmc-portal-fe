const { defineConfig, globalIgnores } = require('eslint/config');
const globals = require('globals');
const { fixupConfigRules } = require('@eslint/compat');
const tsParser = require('@typescript-eslint/parser');
const reactRefresh = require('eslint-plugin-react-refresh');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parser: tsParser,
        },

        extends: fixupConfigRules(
            compat.extends(
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:react-hooks/recommended',
                'plugin:prettier/recommended'
            )
        ),

        plugins: {
            'react-refresh': reactRefresh,
        },

        rules: {
            'prettier/prettier': 'error',
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                },
            ],
        },
    },

    globalIgnores([
        // Build outputs
        '**/dist',
        '**/dist-ssr',

        // Third-party dependencies
        '**/node_modules',

        // Configuration files
        '**/eslint.config.cjs',
        '**/vite.config.ts',
        '**/tsconfig.json',
        '**/tsconfig.node.json',
        '**/.prettierrc',
        '**/.prettierignore',
        '**/.gitignore',
        '**/.gcloudignore',

        // Generated files
        '**/*.d.ts',
        '**/vite-env.d.ts',

        // Documentation and templates
        '**/README.md',
        '**/PULL_REQUEST_TEMPLATE.md',
        '**/.github/**',

        // Other generated/external files
        '**/*.local',
        '**/*.log',
        '**/logs',
        '**/package-lock.json',
        '**/public/**',
        '**/.secret/**',
        '**/Dockerfile',
    ]),
]);
