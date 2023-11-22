/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
      ],
	theme: {
		extend: {
            fontFamily: {
                primary: ['Inter', 'sans-serif'],
                secondary: ['Lato', 'sans-serif']
            }
        },
	},
	plugins: [],
};
