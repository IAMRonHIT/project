/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
      },
      colors: {
        ron: {
          // Core colors
          'primary': '#00344E',
          'secondary': '#004D6B',
          'accent': '#006688',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
          
          // Dark mode colors
          'dark': {
            'base': '#000000', // Jet Black
            'navy': '#000000', // Jet Black
            'surface': '#2A3439', // Dark Gun Metal
          },
          
          // Light mode colors
          'light': {
            'surface': '#FFFFFF',
            'muted': '#64748B',
            'hover': '#F1F5F9',
          },
          
          // Pastel palette
          'mint': {
            50: '#F0FDF9',
            100: '#CCFBEF',
            200: '#B5EAD7',
            300: '#99E6D0',
            400: '#70DBC4',
            500: '#47C1AC',
            600: '#319B8E',
            700: '#1F766E',
          },
          'teal': {
            50: '#F0FDFA',
            100: '#CCFBF1',
            200: '#98D8D8',
            300: '#7CD7D7',
            400: '#4ABEBE',
            500: '#2AA3A3',
            600: '#1C8787',
            700: '#116B6B',
          },
          'lime': {
            50: '#F7FEE7',
            100: '#ECFCCB',
            200: '#DCFFB7',
            300: '#C6F49D',
            400: '#A3E635',
            500: '#84CC16',
            600: '#65A30D',
            700: '#4D7C0F',
          },
          'coral': {
            50: '#FFF5F5',
            100: '#FFE5E5',
            200: '#FFB5A7',
            300: '#FFA192',
            400: '#FF8C7C',
            500: '#FF7366',
            600: '#E65C50',
            700: '#CC463B',
          },
          'pink': {
            50: '#FFF5F7',
            100: '#FFE5EB',
            200: '#FFD1DC',
            300: '#FFB8C9',
            400: '#FF9FB6',
            500: '#FF85A3',
            600: '#E66B89',
            700: '#CC526F',
          },
          
          'divider': {
            DEFAULT: 'rgba(148, 163, 184, 0.1)',
            light: 'rgba(0, 52, 78, 0.1)',
            dark: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 52, 78, 0.06), 0 1px 2px -1px rgba(0, 52, 78, 0.06)',
        'hover': '0 4px 12px 0 rgba(0, 52, 78, 0.08), 0 2px 4px -2px rgba(0, 52, 78, 0.08)',
        'glow': '0 0 10px rgba(255, 255, 255, 0.1)',
        'glow-white': '0 0 15px rgba(255, 255, 255, 0.2)',
        'glow-primary': '0 0 15px rgba(var(--ron-primary), 0.2)',
        'glow-hover': '0 0 15px rgba(74, 190, 190, 0.4)', // Reduced hover glow
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(60deg, var(--tw-gradient-stops))',
        'gradient-glossy': 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'grow-up': {
          '0%': {
            opacity: '0',
            transform: 'scaleY(0)'
          },
          '100%': {
            opacity: '1',
            transform: 'scaleY(1)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'grow-up': 'grow-up 0.5s ease-out forwards'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.white'),
            '--tw-prose-links': theme('colors.ron.teal.400'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.white'),
            '--tw-prose-bullets': theme('colors.ron.teal.400'),
            '--tw-prose-hr': theme('colors.ron.divider.dark'),
            '--tw-prose-quotes': theme('colors.white'),
            '--tw-prose-quote-borders': theme('colors.ron.teal.400'),
            '--tw-prose-captions': theme('colors.white'),
            '--tw-prose-code': theme('colors.ron.teal.300'),
            '--tw-prose-pre-code': theme('colors.white'),
            '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-th-borders': theme('colors.ron.divider.dark'),
            '--tw-prose-td-borders': theme('colors.ron.divider.dark'),

            // Light mode
            '.light &': {
              '--tw-prose-body': theme('colors.gray.900'),
              '--tw-prose-headings': theme('colors.gray.900'),
              '--tw-prose-lead': theme('colors.gray.900'),
              '--tw-prose-links': theme('colors.ron.teal.600'),
              '--tw-prose-bold': theme('colors.gray.900'),
              '--tw-prose-counters': theme('colors.gray.900'),
              '--tw-prose-bullets': theme('colors.ron.teal.600'),
              '--tw-prose-hr': theme('colors.ron.divider.light'),
              '--tw-prose-quotes': theme('colors.gray.900'),
              '--tw-prose-quote-borders': theme('colors.ron.teal.600'),
              '--tw-prose-captions': theme('colors.gray.900'),
              '--tw-prose-code': theme('colors.ron.teal.600'),
              '--tw-prose-pre-code': theme('colors.gray.900'),
              '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.05)',
              '--tw-prose-th-borders': theme('colors.ron.divider.light'),
              '--tw-prose-td-borders': theme('colors.ron.divider.light'),
            },

            // Base styles that apply to both modes
            // Code blocks
            code: {
              color: theme('colors.ron.teal.300'),
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              '&::before': {
                content: 'none !important',
              },
              '&::after': {
                content: 'none !important',
              },
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: theme('colors.white'),
              borderRadius: '0.5rem',
              padding: '1rem',
              overflowX: 'auto',
            },
            // Tables
            table: {
              borderCollapse: 'separate',
              borderSpacing: '0',
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'th, td': {
              borderWidth: '1px',
              borderColor: theme('colors.ron.divider.dark'),
              padding: '0.75rem',
            },
            th: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              fontWeight: '600',
            },
            // Lists
            ul: {
              li: {
                '&::before': {
                  backgroundColor: theme('colors.ron.teal.400'),
                },
              },
            },
            // Math equations
            '.math': {
              color: theme('colors.white'),
              padding: '0.5rem 0',
            },
            // Blockquotes
            blockquote: {
              borderLeftColor: theme('colors.ron.teal.400'),
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: '1rem',
              borderRadius: '0.25rem',
            },
            // Task lists
            'input[type="checkbox"]': {
              color: theme('colors.ron.teal.400'),
            },
          },
        },
      }),
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
