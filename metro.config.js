const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude test spec files and test-only directories from the app bundle.
// Must spread the existing blockList so we don't lose Expo's defaults.
config.resolver.blockList = [
  /\.spec\.[jt]sx?$/,
  /\/mocks\//,
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : config.resolver.blockList
    ? [config.resolver.blockList]
    : []),
];

module.exports = withNativeWind(config, { input: "./global.css" });
