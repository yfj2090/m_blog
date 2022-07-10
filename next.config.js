const path = require('path')
const withPlugins = require('next-compose-plugins')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = withPlugins([
  [{
    // cssModules: true,
    // cssLoaderOptions: {
    //   localIdentName: '[local]___[hash:base64:5]',
    // },
    webpack(config, { isServer }) {
      const fontLoaderRule = {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]'),
        }
      }
      const imageRule = {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]'),
          fallback: 'file-loader',
          publicPath: '/_next/',
          outputPath: '',
        },
      }

      config.module.rules.push(fontLoaderRule)
      config.module.rules.push(imageRule);

      // alias
      config.resolve.alias = {
        ...config.resolve.alias,
        '@components': resolve('./components'),
        '@constant': resolve('./constants'),
        '@lib': resolve('./lib'),
        '@plugins': resolve('./plugins'),
        '@style': resolve('./styles'),
        '@store': resolve('./store'),
        '@root': resolve('./')
      }

      return config
    }
  }],
])
