/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ron: {
          // Core brand colors
          'primary': '#00344E',
          'secondary': '#004D6B',
          'accent': '#00F0FF',
          
          // Light mode
          'light': {
            'surface': '#FFFFFF',
            'hover': '#F1F5F9',
            'muted': '#64748B'
          },
          
          // Dark mode
          'dark': {
            'base': '#000000',
            'surface': '#111827',
            'muted': '#374151'
          },
          
          // Status colors
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444'
        }
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
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
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(0.5rem)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'grow-up': 'grow-up 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.2s ease-out forwards'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.white'),
            '--tw-prose-links': theme('colors.blue.400'),
            '--tw-prose-bold': theme('colors.blue.400'),
            '--tw-prose-counters': theme('colors.blue.400'),
            '--tw-prose-bullets': theme('colors.blue.400'),
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

            // Healthcare-specific styles
            h2: {
              color: theme('colors.blue.300'),
              borderBottom: `1px solid ${theme('colors.gray.700')}`,
              paddingBottom: '0.5rem',
              marginBottom: '1rem'
            },
            'ul > li': {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              paddingLeft: '0.5rem'
            },
            'ol > li': {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              paddingLeft: '0.5rem'
            },
            'blockquote p:first-of-type::before': {
              content: 'none'
            },
            'blockquote p:last-of-type::after': {
              content: 'none'
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
