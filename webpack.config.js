const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src/main.js'),
    ],
    output:{
      assetModuleFilename: '[name][ext][query]'
    },
    //devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            /*{
              test: /\worker.js/,
              type: 'asset/resource'
            },
            {
              test: /\worker.data/,
              type: 'asset/resource'
            },
            {
              test: /\worker.wasm/,
              type: 'asset/resource'
            },*/
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
                {
                  loader:'sass-loader',
                  options:{
                    additionalData:`@import "./src/variables.scss";`
                  }
                }

              ]
            },
            {
              test: /\.css$/,
              use: [
                'vue-style-loader',
                'css-loader',
              ]
            },

        ]
    },
    plugins:[
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
          template: "./src/index.html",
          inject: true
      }),

    ],

    resolve: {

        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.ts','.js']
    }
};
