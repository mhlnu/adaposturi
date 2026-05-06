/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./pages/**/*.{js,jsx,ts,tsx,scss,mdx,css}",
        "./app/**/*.{js,ts,jsx,tsx,mdx,scss,css}",
        "./components/**/*.{js,ts,jsx,tsx,mdx,scss,css}",
        "./src/**/*.{js,jsx,ts,tsx,mdx,scss,css}",
        "./styles/**/*.{js,jsx,ts,tsx,mdx,scss,css}",
    ],
    safelist: [{ pattern: /row-span-(1[0-2]|[1-9])/ }],
};
