
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './client/src',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
