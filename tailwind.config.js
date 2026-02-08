/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/components/**/*.{js,vue,ts}",
        "./app/layouts/**/*.vue",
        "./app/pages/**/*.vue",
        "./app/plugins/**/*.{js,ts}",
        "./app/app.vue",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta de Cores Profissional (conforme a imagem do usuário)
                cafe: {
                    light: '#8B6B42',
                    DEFAULT: '#6F4F28',
                    dark: '#4A351B',
                },
                moca: {
                    light: '#B37A60',
                    DEFAULT: '#9B5C42',
                    dark: '#7F4A35',
                },
                bege: {
                    torrado: '#A67B5B',
                    claro: '#C0977D',
                    cream: '#FDFBF7', // Bege claríssimo para fundos de sistema
                    soft: '#E8D8C4',
                },
                // Cores complementares/básicas
                preto: {
                    DEFAULT: '#1A1A1A',
                    pure: '#000000',
                },
                branco: {
                    DEFAULT: '#FFFFFF',
                    dirty: '#F5F2ED',
                },
            },
            fontFamily: {
                // Fonte 'Outfit' é extremamente moderna e profissional para Dashboards
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // Escala tipográfica padronizada
                'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
                'heading-2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
                'heading-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
                'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
                'description': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
                'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(111, 79, 40, 0.1), 0 2px 10px -1px rgba(111, 79, 40, 0.05)',
            }
        },
    },
    plugins: [],
}
