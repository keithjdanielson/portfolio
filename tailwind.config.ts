import type { Config } from 'tailwindcss';
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: '#F0EAD6' // Egg Shell
				},
				// one: '#A19687', COpied pallete
				// two: '#000000',
				// three: '#56483F',
				// four: '#8D8B7D',

				// one: '#A19687',

				// one: '#4A3E37',
				// two: '#6f5e53',
				// three: '#8a7968',
				// four: '#593d3b',

				// one: '#4A3E37',
				one: '#3D352E',

				// two: '#6f5e53', original
				two: '#5b4f47',
				three: '#8a7968',
				four: '#593d3b',

				// cardOne: '#4A3E37',
				// cardTwo: '#593d3b',
				// cardThree: '#6f5e53',
				// cardFour: '#8a7968',
				text: {
					DEFAULT: '#2A2420',
					light: '#FFFFFF'
				}
			},
			fontFamily: {
				headers: ['Lora', 'serif'],
				secondary: ['Space Mono', 'arial']
			}
		}
	},
	plugins: []
} satisfies Config;
