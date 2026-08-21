/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        extend: {
            colors: {
                stripe: {
                    bg: '#f6f9fc',
                    card: '#ffffff',
                    text: '#32325d',
                    accent: '#6772e5'
                }
            }
        },
    },
    plugins: [],
}
