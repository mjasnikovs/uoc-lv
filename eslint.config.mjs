// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
	languageOptions: {
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname
		}
	},
	rules: {
		'@typescript-eslint/no-unsafe-call': 'warn',
		'@typescript-eslint/no-unsafe-member-access': 'warn',
		'@typescript-eslint/require-await': 'warn',
		'@typescript-eslint/no-unsafe-argument': 'warn',
		'@typescript-eslint/no-misused-promises': 'warn',
		'@typescript-eslint/no-unsafe-enum-comparison': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
		'@typescript-eslint/no-explicit-any': 'error',
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'no-tabs': 0,
		'object-curly-spacing': [2, 'never'],
		'array-bracket-spacing': [2, 'never'],
		'computed-property-spacing': [2, 'never'],
		'brace-style': [2, '1tbs'],
		'keyword-spacing': [2],
		'eol-last': [2],
		'no-trailing-spaces': [2],
		'no-redeclare': 2,
		'no-shadow': 2,
		properties: 0,
		camelcase: 0
	}
})
