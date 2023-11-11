const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    // Override the Next.js default behavior for JS and JSX files
    // Note: You'll need to modify the regex below to include the specific modules you want to transform.
    config.module.rules.push({
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, 'node_modules/picasso.js'),
        path.resolve(__dirname, 'node_modules/run-script'),
      ],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ["next/babel", "@babel/preset-react"],
          plugins: ["@babel/plugin-transform-react-jsx"]
        },
      }],
    });

    return config;
  },
};
