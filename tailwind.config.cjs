/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "sans-serif", ...defaultTheme.fontFamily.sans],
				mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace", ...defaultTheme.fontFamily.mono],
			},
			letterSpacing: {
				'display-xl': '-2.4px',
				'display-lg': '-1.28px',
				'display-md': '-0.96px',
				'display-sm': '-0.6px',
				'body-sm': '-0.28px',
			},
			borderRadius: {
				'lg': '12px',
				'xl': '16px',
				'2xl': '20px',
				'pill': '100px',
				'pill-sm': '64px',
			},
			spacing: {
				'4xl': '64px',
				'5xl': '96px',
				'6xl': '128px',
			},
			transitionTimingFunction: {
				'linear-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
