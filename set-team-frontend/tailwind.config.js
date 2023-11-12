/** @type {import('tailwindcss').Config}
 *
 */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            maxWidth: {
                '1/2': '50%',
                '3/4': '75%',
            },
            fontFamily: {
                // montserrat: ['Montserrat', 'sans-serif'],
                robotoMono: ['Roboto Mono', 'monospace'],
            },
            padding: {
                '20%': '20%',
                '20vh': '20vh',
            },
            backgroundImage: {
                'hero-pattern': 'url(./src/assets/boxes.svg)',
                login: 'url(./src/assets/login_pic.jpg)',
            },
            animation: {
                blob: 'blob 7s infinite',
                textColorChange: 'textColorChange 4s infinite ease-in-out',
            },
            keyframes: {
                blob: {
                    '0%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                },
                textColorChange: {
                    '0%': {
                        color: 'rgb(191 219 254)',
                    },
                    '50%': {
                        color: 'rgb(255 255 255)',
                    },
                    '100%': {
                        color: 'rgb(191 219 254)',
                    },
                },
            },
        },
    },
    plugins: [],
    safelist: [
        'bg-red-400',
        'bg-red-200',
        'border-red-400',
        'border-red-200',
        'hover:bg-red-300',
        'bg-orange-400',
        'bg-orange-200',
        'border-orange-400',
        'border-orange-200',
        'hover:bg-orange-300',
        'bg-yellow-400',
        'bg-yellow-200',
        'border-yellow-400',
        'border-yellow-200',
        'hover:bg-yellow-300',
        'bg-lime-400',
        'bg-lime-200',
        'border-lime-400',
        'border-lime-200',
        'hover:bg-lime-300',
        'bg-emerald-400',
        'bg-emerald-200',
        'border-emerald-400',
        'border-emerald-200',
        'hover:bg-emerald-300',
        'border-cyan-400',
        'border-cyan-200',
        'bg-cyan-400',
        'bg-cyan-200',
        'hover:bg-cyan-300',
        'bg-indigo-400',
        'bg-indigo-200',
        'border-indigo-400',
        'border-indigo-200',
        'hover:bg-indigo-300',
        'bg-green-600',
        'bg-green-200',
        'border-green-600',
        'border-green-200',
        'hover:bg-green-400',
        'bg-gray-600',
        'border-gray-600',
        'border-gray-200',
        'hover:bg-orange-400',
        'bg-orange-600',
        'bg-orange-200',
        'border-orange-600',
        'border-orange-200',
        'bg-blue-200',
        'bg-blue-400',
        'border-blue-200',
        'border-blue-400',
    ],
};
