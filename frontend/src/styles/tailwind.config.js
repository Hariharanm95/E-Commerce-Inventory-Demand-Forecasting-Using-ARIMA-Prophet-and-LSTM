/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        // Add your custom theme extensions here, e.g., colors, fonts, etc.
        colors: {
          'custom-blue': '#1E3A8A', // Example custom color
        },
      },
    },
    plugins: [
      // Add any Tailwind CSS plugins here
    ],
  }