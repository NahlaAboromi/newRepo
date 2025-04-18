module.exports = {
  content: ["./*.{html,js,ts}"],
  darkMode: 'class',
  theme: {
    extends:{},
    screens: {
      'sm': '640px',
      //=> @media(min-width: 640px){...}
      'md' : '768px',
      //=> @media(min-width: 768px){...}
      'lg' : '1024px',
      //=> @media(min-width: 1024px){...}
      'xl' : '1280px',
      //=> @media(min-width: 1280px){...}
      '2xl' : '1536px'
      //=> @media(min-width: 1536px){...}
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio")
  ],
};

safelist: [
  'bg-green-500',
  'bg-blue-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-100', 'text-indigo-800', 'dark:bg-indigo-800', 'dark:text-indigo-100',
  'bg-purple-100', 'text-purple-800', 'dark:bg-purple-800', 'dark:text-purple-100',
  'bg-blue-100', 'text-blue-800', 'dark:bg-blue-800', 'dark:text-blue-100',
  'bg-orange-100', 'text-orange-800', 'dark:bg-orange-800', 'dark:text-orange-100',
  'bg-gray-100', 'text-gray-800', 'dark:bg-gray-800', 'dark:text-gray-100',
]
