const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src/main.js'),
    ],
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader'
              ]
            }

        ]
    },
    plugins:[
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
          template: "./src/index.html"
      }),

    ],

    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: []
    }
};
