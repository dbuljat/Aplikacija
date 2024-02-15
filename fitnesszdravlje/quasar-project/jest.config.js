module.exports = {
    preset: '@quasar/jest-preset',
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
      '<rootDir>/node_modules/(?!quasar/lang|quasar/preset)',
    ],
    testMatch: [
      '<rootDir>/tests/unit/**/*.spec.js',
    ],
    setupFilesAfterEnv: [
      '<rootDir>/tests/unit/setup.js',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,vue}',
      '!src/main.js',
    ],
  };