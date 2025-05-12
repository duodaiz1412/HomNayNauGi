module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@assets': './src/assets',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@navigation': './src/navigation',
            '@constants': './src/constants',
            '@store': './src/store',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
