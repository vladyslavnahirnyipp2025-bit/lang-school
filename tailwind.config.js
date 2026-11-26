/** Дизайн-система школи «Репліка». Кожна мова має власний колір. */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F5FF',
        night: '#171C4D',
        ultra: { DEFAULT: '#3141C8', dark: '#222E9A' },
        sun: '#FFD23F',
        coral: '#FF7A6B',
        mint: '#3DD6B0',
        sky: '#8EB8FF'
      },
      fontFamily: {
        sans: ['Onest', '"Onest Fallback"', 'system-ui', 'sans-serif'],
        display: ['Unbounded', '"Unbounded Fallback"', 'system-ui', 'sans-serif']
      },
      // Власні анімації: спочатку кадри (keyframes), потім класи animate-*
      keyframes: {
        // Без opacity: прозорий на старті текст погіршував показник LCP
        rise: {
          '0%': { transform: 'translateY(32px)' },
          '100%': { transform: 'translateY(0)' }
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(.6) translateY(12px)' },
          '70%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-6deg)' },
          '50%': { transform: 'translateY(-20px) rotate(6deg)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        dot: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '.4' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' }
        },
        draw: { to: { strokeDashoffset: '0' } },
        confetti: {
          '0%': { opacity: '1', transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translate(var(--x), var(--y)) rotate(540deg)' }
        }
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.8,.2,1) both',
        pop: 'pop .45s cubic-bezier(.2,.8,.2,1) both',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        dot: 'dot 1.1s ease-in-out infinite',
        shake: 'shake .35s ease-in-out 2',
        draw: 'draw .7s .25s ease-out forwards',
        confetti: 'confetti 1.2s ease-out forwards'
      }
    }
  },
  plugins: []
};
