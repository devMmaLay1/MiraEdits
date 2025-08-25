// Tailwind CSS Configuration - Mobile-First
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./css/**/*.css"
  ],
  theme: {
    extend: {
      // Mobile-First Breakpoints
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      // Brand Colors
      colors: {
        'primary-pink': '#FF69B4',
        'light-pink': '#FFC0CB',
        'dark-gray': '#333333',
        'light-gray': '#F8F9FA',
      },
      // Brand Typography
      fontFamily: {
        'brand': ['Poppins', 'sans-serif'],
        'slogan': ['Courier New', 'monospace'],
        'body': ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        'brand': '800',
        'slogan': '700',
      },
      // Mobile-First Spacing
      spacing: {
        'touch': '44px', // Minimum touch target
        '18': '4.5rem',
        '88': '22rem',
      },
      // Mobile-Safe Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}