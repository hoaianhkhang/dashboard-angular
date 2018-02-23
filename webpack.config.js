var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = function (env) {

    return {
        context: __dirname + '/src/app/',
        entry: {
            vendor: ['jquery','angular','angular-toastr','angular-confirm1','ng-file-upload',
                     'angular-sanitize','angular-cookies','angular-bootstrap','@uirouter/angularjs',
                     '@iamadamjowett/angular-click-outside','iso-3166-country-codes-angular','ng-csv',
                     'ng-country-select-fixed','ngclipboard','ng-intl-tel-input','underscore'],
            app: './app.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[chunkhash].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: '../index.html',
                inject: true,
                hash: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                // filename: "vendor.js"
                // (Give the chunk a different name)

                minChunks: Infinity
                // (with more entries, this ensures that no other module
                //  goes into the vendor chunk)
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new webpack.DefinePlugin({
                "DASHBOARD_ENV": JSON.stringify(env.NODE_ENV),
                "STAGING_URL": JSON.stringify("https://api.staging.rehive.com/api/3"),
                "LOCAL_URL": JSON.stringify("https://api.rehive.com/3"),
                "PROD_URL": JSON.stringify("https://api.rehive.com/3"),
                "DOCKER_URL": JSON.stringify("{{API_URL}}")
            })
        ],
        devServer: {
            port: 3000,
            historyApiFallback: {
                index: './dist/index.html'
            },
            open: true
        }
    };
};