import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
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
		},
	},
	plugins: [daisyui],
};
