/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  clearMocks: true,
  // Exclude the shared test-utils helper (not a test suite)
  testPathIgnorePatterns: ['/node_modules/', '/test-utils\\.tsx?$/'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
    // async_hooks is a Node built-in not available in the RN jest environment.
    '^async_hooks$': '<rootDir>/__mocks__/async_hooks.js',
    // MSW v2 uses package exports which the RN jest environment doesn't resolve.
    // Map MSW and @mswjs/interceptors subpaths to their CommonJS builds directly.
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
    '^@mswjs/interceptors$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/index.cjs',
    '^@mswjs/interceptors/ClientRequest$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/ClientRequest/index.cjs',
    '^@mswjs/interceptors/XMLHttpRequest$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/XMLHttpRequest/index.cjs',
    '^@mswjs/interceptors/fetch$': '<rootDir>/node_modules/@mswjs/interceptors/lib/node/interceptors/fetch/index.cjs',
  },
  // Handle pnpm's nested node_modules/.pnpm/<pkg>/node_modules/<pkg> structure.
  // Also include MSW deps (until-async is ESM-only and needs Babel transform).
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|react-native-css-interop|msw|@mswjs|until-async))',
  ],
};
