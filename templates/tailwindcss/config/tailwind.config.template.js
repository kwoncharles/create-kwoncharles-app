const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'simple-gray': {
          000: '#1e1e1e',
        }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents([
        ...customComponents,
      ])
    })
  ],
}

const customComponents = [
  {
    '.tap-transparent': {
      '-webkit-tap-highlight-color': 'transparent',
    },
  },
  {
    '.keep-all': {
      'word-break': 'keep-all',
    },
  },
  {
    '.no-pointer-event': {
      'pointer-events': 'none',
    },
  },
  {
    '.visually-hidden': {
      position: 'absolute',
      clip: 'rect(1px,1px,1px,1px)',
      '-webkit-clip-path': 'inset(0 0 99.9% 99.9%)',
      clipPath: 'inset(0 0 99.9% 99.9%)',
      overflow: 'hidden',
      height: '1px',
      width: '1px',
      padding: '0',
      border: '0',
    }
  },
];
