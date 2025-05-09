import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import globals from "globals";

// console.log("Available typescriptEslintPlugin.configs:", typescriptEslintPlugin.configs); // Removed log

// Workaround for https://github.com/sindresorhus/globals/issues/239
const browserGlobals = Object.fromEntries(
    Object.entries(globals.browser).map(([key, value]) => [
        key.trim(),
        value,
    ])
);

// mergeRulesFromConfigs might not be needed if we apply configs directly
// const mergeRulesFromConfigs = (configsArray) => { ... }; 

export default [
    // 1. Global Ignores
    {
        ignores: [
            "dist/", "node_modules/", "storybook-static/", "coverage/",
            "build/", "lib/", ".cache/", ".vscode/", ".idea/", "*.log",
            "**/*.stories.tsx" // Exclude stories from global type-checking early on
        ]
    },

    // 2. ESLint Recommended (for JS files primarily, but base for others)
    js.configs.recommended,

    // 3. TypeScript Recommended Type-Checked Configurations
    // Spread each config object from the plugin's recommended set, ensuring file scope and plugin def
    ...(typescriptEslintPlugin.configs['flat/recommended-type-checked'] || []).map(config => ({
        ...config,
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            ...(config.plugins || {})
        },
        languageOptions: {
            ...(config.languageOptions || {}),
            parser: tsParser, // Ensure parser for these specific configs
            parserOptions: {
                ...(config.languageOptions?.parserOptions || {}),
                project: true,
                tsconfigRootDir: import.meta.dirname,
            }
        }
    })),

    // 4. React Recommended Flat Config
    // Apply as a single object, ensuring file scope and plugin def
    {
        ...(reactPlugin.configs.flat.recommended || {}),
        files: ["**/*.{ts,tsx,jsx}"],
        plugins: {
            'react': reactPlugin,
            ...(reactPlugin.configs.flat.recommended?.plugins || {})
        },
        settings: {
            react: { version: "detect" },
            ...(reactPlugin.configs.flat.recommended?.settings || {})
        }
    },

    // 5. Main Project-Specific Overrides for ALL TS/TSX files (excluding stories)
    // This comes AFTER the recommended sets to ensure its rules take precedence.
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            'react': reactPlugin
        },
        languageOptions: { // Only define what's not covered or needs override from above
            parser: tsParser, // Could be inherited, but explicit for clarity
            parserOptions: { // Could be inherited
                project: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: { ...browserGlobals, ...globals.node },
        },
        settings: { // Could be inherited
            react: { version: "detect" }
        },
        rules: {
            // All our specific overrides
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-duplicate-enum-values": "off",

            "react/no-unknown-property": ["error", { "ignore": ["qe-id"] }],
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            // no-undef should be handled by TS itself for TS files if `project` is correct
        },
    },
    
    // JS/CJS files config (block #6)
    {
        files: ["*.js", "*.cjs", "scripts/**/*.js"], 
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest",
            globals: { ...globals.node },
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off", 
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" , "varsIgnorePattern": "^_"}],
            "no-undef": "error",
            "no-useless-escape": "off", 
        }
    },

    // Storybook JS files (ESM) config (block #7)
    {
        files: [".storybook/**/*.js", "v2/.storybook/**/*.js"],
        languageOptions: {
            sourceType: "module",
            ecmaVersion: "latest",
            globals: { ...globals.node }, 
        },
        rules: {
            "no-unused-vars": "off", 
            "no-undef": "error",
        }
    },

    // Story files (*.stories.tsx) config - Non-type-checked (block #8)
    {
        files: ["**/*.stories.tsx"], 
        plugins: { 
            '@typescript-eslint': typescriptEslintPlugin, 
            'react': reactPlugin 
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: { 
                ecmaVersion: "latest",
                sourceType: "module",
            },
             globals: { ...browserGlobals, ...globals.node },
        },
        settings: { react: { version: "detect" } },
        rules: {
            // Apply non-type-checked recommended TS rules
            ...((typescriptEslintPlugin.configs['flat/recommended'] || []).reduce((acc, config) => ({ ...acc, ...(config.rules || {}) }), {})),
            // Apply React recommended rules
            ...((reactPlugin.configs.flat.recommended?.rules || {})),
            // Story-specific overrides
            "react/display-name": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "off"
        },
    },

    // Test files (*.spec.tsx) config - Type-checked (block #9)
    {
        files: ["**/*.spec.tsx"],
        plugins: { '@typescript-eslint': typescriptEslintPlugin, 'react': reactPlugin }, 
        languageOptions: {
            globals: { ...globals.jest },
            parser: tsParser, 
            parserOptions: {
                project: true, 
                tsconfigRootDir: import.meta.dirname, 
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        settings: { react: { version: "detect" } }, 
        rules: {
            // Apply type-checked rules for tests
            ...((typescriptEslintPlugin.configs['flat/recommended-type-checked'] || []).reduce((acc, config) => ({ ...acc, ...(config.rules || {}) }), {})),
            ...((reactPlugin.configs.flat.recommended?.rules || {})),
            // Test-specific overrides
            "no-undef": "error", 
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" , "varsIgnorePattern": "^_"}],
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/unbound-method": "off"
        }
    },

    // Specific config for v2 components to try and resolve ban-types issue
    {
        files: ["v2/components/**/*.tsx"], // Target v2 components specifically
        plugins: { 
            '@typescript-eslint': typescriptEslintPlugin,
            'react': reactPlugin // Include react if react rules also apply/need override here
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true, 
                tsconfigRootDir: import.meta.dirname, 
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: { ...browserGlobals, ...globals.node },
        },
        settings: { 
            react: { version: "detect" } 
        },
        rules: {
            // Rules from recommended-type-checked, to ensure context
            ...(typescriptEslintPlugin.configs['flat/recommended-type-checked'] || []).reduce((acc, config) => ({...acc, ...(config.rules || {})}), {}),
            ...(reactPlugin.configs.flat.recommended.rules || {}),

            // OUR CRITICAL OVERRIDES - these should be the final word for these rules
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" , "varsIgnorePattern": "^_"}],
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-duplicate-enum-values": "off",
            "react/prop-types": "off", 
            "react/react-in-jsx-scope": "off", 
        }
    }
];