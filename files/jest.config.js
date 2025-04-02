module.exports = {
  rootDir: '.',
  testMatch: ['**/*.{spec,test}.{js,jsx}'],
  collectCoverageFrom: ['**/*.{js,jsx}'],
  modulePathIgnorePatterns: ['./dist'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['node_modules/(?!(@pnp-revin/utils)/)'],
  transform: {
    '\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '^assets(.*)$': '<rootDir>/src/assets/$1',
    '^components(.*)$': '<rootDir>/src/components/$1',
    '^store(.*)$': '<rootDir>/src/store/$1',
    '^utils(.*)$': '<rootDir>/src/utils/$1',
    '^mocks(.*)$': '<rootDir>/src/__mocks__/$1',
    '^testUtils(.*)$': '<rootDir>/src/__tests__/utils/$1'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/setupTests.js']
};
