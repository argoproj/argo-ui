import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Workaround for https://github.com/sindresorhus/globals/issues/239
const browserGlobals = Object.fromEntries(
    Object.entries(globals.browser).map(([key, value]) => [
        key.trim(),
        value,
    ])
);

// Instantiate FlatCompat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    // Global ignores
    {
        ignores: [
            "dist/",
            "node_modules/",
            "storybook-static/",
            "coverage/",
            "build/",
            "lib/",
            // Added common ignores
            ".cache/",
            ".vscode/",
            ".idea/",
            "*.log"
        ]
    },
    // Base JS/ESLint recommended config (applies to JS/TS files by default mechanism)
    js.configs.recommended,
    // Configuration for TS/TSX files
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            tsEslint: typescriptEslintPlugin,
            react: reactPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                ...browserGlobals,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // Use FlatCompat for typescript-eslint recommended rules
            ...compat.config({ extends: ["plugin:@typescript-eslint/recommended"] })[0].rules,

            // Recommended rules from eslint-plugin-react (Keep direct spread as it seems compatible)
            ...reactPlugin.configs.recommended.rules,

            // Custom overrides - Place these *after* spreading recommended rules
            "tsEslint/no-explicit-any": "off",
            "tsEslint/no-non-null-assertion": "off",
            "tsEslint/ban-types": "off",
            // Allow require imports for now, can tighten later if desired
            "tsEslint/no-require-imports": "off",
             // Allow custom prop 'qe-id'
            "react/no-unknown-property": ["error", { "ignore": ["qe-id"] }],
            // Disable other new/strict rules for now
            "tsEslint/no-unsafe-function-type": "off",
            "tsEslint/no-duplicate-enum-values": "off",
            // Other adjustments based on initial run could go here
             "no-undef": "off", // Temporarily disable no-undef until globals are fully sorted
             "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }] // Adjust unused vars slightly

        },
    },
     // Configuration for JS/CJS files (e.g., config files)
    {
        files: ["**/*.{js,cjs}"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest", // or appropriate version for your config files
             globals: {
                 ...globals.node, // Node globals for CJS files
            },
        },
        rules: {
            // Potentially relax rules for config files if needed
             "tsEslint/no-require-imports": "off", // Allow require in JS/CJS
             "no-undef": "error" // Re-enable no-undef specifically for JS/CJS
        }
    },
    // Configuration for Storybook JS files (using ESM)
    {
        files: [".storybook/*.js", "v2/.storybook/*.js"],
        languageOptions: {
            sourceType: "module",
            ecmaVersion: "latest",
            globals: {
                ...globals.node, // Storybook config often runs in Node
            },
        },
        rules: {
            // Relax rules if needed for Storybook config files
            "no-unused-vars": "off", // Allow unused vars in Storybook config
            "no-undef": "error"
        }
    },
    // Override for story files
    {
        files: ["./stories/*.tsx", "./v2/**/*.stories.tsx"], // Include v2 stories
        rules: {
            "react/display-name": "off",
            "tsEslint/no-unused-vars": "off",
        },
    },
    // Override for test files
    {
        files: ["**/*.spec.tsx"],
        languageOptions: {
             globals: {
                 ...globals.jest, // Add Jest globals for test files
            },
        },
        rules: {
             "no-undef": "error" // Re-enable no-undef specifically for tests
        }
    }
];