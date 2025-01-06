import type { Config } from 'tailwindcss';
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: '#F0EAD6' // Egg Shell
				},
				one: '#3D352E',
				two: '#5b4f47',
				three: '#8a7968',
				four: '#593d3b',

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
