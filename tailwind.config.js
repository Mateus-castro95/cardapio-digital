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
                // Paleta Nobre: Preto com Dourado (Adega & Wine Bar)
                cafe: {
                    light: '#FFF2B2',   // Dourado claríssimo brilhante
                    DEFAULT: '#D4AF37', // Dourado metálico nobre clássico
                    hover: '#BFA030',   // Dourado fechado para hover
                    dark: '#E8C86A',    // Dourado vivo luminoso (para títulos e textos com text-cafe-dark)
                },
                moca: {
                    light: '#FFF4CC',   // Champagne suave
                    DEFAULT: '#F0CE65', // Dourado brilhante / realce
                    dark: '#D4AF37',    // Ouro clássico
                },
                bege: {
                    torrado: '#CFC3AA', // Letras champagne / leitura secundária suave e nítida
                    claro: '#F7E5B5',   // Dourado suave luminoso para textos de destaque
                    cream: '#0A0A0C',   // Fundo preto da adega (Obsidian Jet Black)
                    soft: '#DDD2BC',    // Letras champagne nos menus e links (100% legíveis sobre o preto)
                },
                dourado: {
                    light: '#F7E7A9',
                    DEFAULT: '#D4AF37',
                    dark: '#AA8518',
                },
                // Cores complementares/básicas
                preto: {
                    light: '#1E1E24',
                    DEFAULT: '#0A0A0C',
                    card: '#141417',
                    surface: '#18181C',
                    pure: '#000000',
                },
                branco: {
                    DEFAULT: '#FFFFFF',
                    dirty: '#FAF8F5',
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
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 15px -2px rgba(212, 175, 55, 0.08)',
                'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
            }
        },
    },
    plugins: [],
}
