const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react');
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'revin',
    projectName: 'forecasting',
    webpackConfigEnv,
    argv
  });

  const envPath = webpackConfigEnv.ENVIRONMENT
    ? `./env/.env.${webpackConfigEnv.ENVIRONMENT}`
    : './env/.env';

  if(argv.mode === 'production') {
    delete defaultConfig.devtool;
  }
  
  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'sass-loader' // compiles Sass to CSS
            }
          ]
        },
        {
          test: /\.(jpg|gif|png)$/i,
          include: [ path.resolve(__dirname, 'node_modules/')],
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    externals: ['react', 'react-dom'],
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        assets: path.resolve(__dirname, 'src/assets'),
        // eslint-disable-next-line no-undef
        utils: path.resolve(__dirname, 'src/utils'),
        // eslint-disable-next-line no-undef
        components: path.resolve(__dirname, 'src/components'),
        // eslint-disable-next-line no-undef
        store: path.resolve(__dirname, 'src/store'),
        '@material-ui/core': '@material-ui/core/es',
        '@material-ui/icons': '@material-ui/icons/esm',
        '@pnp-snap': '@pnp-blox/snap/dist/esm/controls/',
        '@revin-utils': '@pnp-revin/utils/dist/esm/'
      }
    },
    plugins: [
      new Dotenv({
        path: envPath
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        '...',
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            },
            compress: {
              drop_console: true
            }
          },
          extractComments: false
        })
      ]
    }
  });
};
