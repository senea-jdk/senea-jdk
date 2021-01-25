module.exports = {
  transform: {
    '\\.js$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/env',
            {
              modules: 'auto',
              useBuiltIns: 'usage',
              corejs: 3,
            },
          ],
        ],
      },
    ],
  },
};
