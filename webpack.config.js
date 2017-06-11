const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEV = process.env.NODE_ENV === 'development';
const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: DEV
});


module.exports = {

    devtool: 'eval',    // For sourcemaps

    entry: {
        'bundle': './src/entry.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {
        rules: [{
            test: /\.(htm|html)$/,
            use: [ 'html-loader' ]
        },
        {
            test: /\.(scss|sass)$/,
            use: extractSass.extract({
                use: [
                    {
                        // https://github.com/webpack-contrib/css-loader
                        loader: 'css-loader',
                        options: {
                            minimize: !DEV
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
                // use style-loader in development
                fallback: 'style-loader'
            })
        }]
    },

    devServer: {
        // hot: true,
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        }
    },

    plugins: [
        // new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            template: 'src/index.html',

            // https://github.com/kangax/html-minifier#options-quick-reference
            minify: DEV ? false : {
                removeComments: true,
                preserveLineBreaks: false
            }
        }),
        
        extractSass,

        // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
        DEV ? [] : new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]

    /*htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/],
        root: path.resolve(__dirname, 'assets'),
        attrs: ['img:src', 'link:href']
    }*/
};