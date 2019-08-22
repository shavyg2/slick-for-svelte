module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  "transform": {
    "\\.svelte$": "jest-transform-svelte"
  },
  "moduleFileExtensions": [
    "js",
    "ts",
    "json",
    "svelte"
  ]


};