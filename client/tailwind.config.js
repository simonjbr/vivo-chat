import daisyui from 'daisyui';
import plugin from 'tailwindcss/plugin';
/** @type {import('tailwindcss').Config} */
export default {
	mode: 'jit',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
		},
		extend: {
			colors: {
				'rich-black': '#031826',
				moonstone: '#6A9CA0',
				platinum: '#DFDFE2',
				zomp: '#329A79',
				claret: '#6A1127',
				'mint-green': '#CCE0DA',
				'tea-green': '#CCFBAF',
				'lime-green': '#21D427',
				'lime-greener': '#21FD27',
				'steel-blue': '#4D7EA8',
			},
			fontFamily: {
				teko: ['Teko', 'serif'],
				roboto: ['Roboto', 'serif'],
			},
			textShadow: {
				sm: '0 0px 1px #21FD27',
				DEFAULT: '1px 1px 3px #21FD27',
				lg: '1px 1px 8px #21FD27',
			},
		},
	},
	plugins: [
		daisyui,
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'text-shadow': (value) => ({
						textShadow: value,
					}),
				},
				{ values: theme('textShadow') }
			);
		}),
	],
};
