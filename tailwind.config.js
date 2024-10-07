/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'], // Ajustez le chemin selon vos fichiers
    corePlugins: {
      preflight: false,  // Désactive le reset CSS intégré si vous n'en avez pas besoin
      // Activez uniquement les plugins pour le système de grille
      container: true,
      gridTemplateColumns: true,
      gridColumn: true,
      gridColumnStart: true,
      gridColumnEnd: true,
      gridTemplateRows: true,
      gridRow: true,
      gridRowStart: true,
      gridRowEnd: true,
      gap: true,
      space: true, // Pour les espaces dans les grilles
      divideWidth: true, // Pour les diviseurs entre les colonnes
      justifyContent: true,
      alignItems: true,
      justifyItems: true,
      alignContent: true,
      justifySelf: true,
      alignSelf: true,
      height: true,
      width: true
    },
    theme: {
      extend: {},
    },
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
    ],
  }
  
  