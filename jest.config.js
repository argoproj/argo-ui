module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.json'
    }
  }
};
