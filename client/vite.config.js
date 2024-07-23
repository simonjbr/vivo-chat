import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/graphql': {
				target: 'http://localhost:5000',
			},
			'/subscription': {
				target: 'ws://localhost:5000',
				ws: true,
				rewriteWsOrigin: true,
			}
		},

	},
});
