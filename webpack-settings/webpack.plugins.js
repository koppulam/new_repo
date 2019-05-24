const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const assembleWebpack = require('assemble-webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')


const PROJECT_CONFIG = require('../project-config.js');

const { HANDLEBARS_DIR, JS_LIB } = PROJECT_CONFIG;

module.exports = function getPlugins(options) {
    let API_BASE_URL = false;
    let cssOptimisation;

    if (options.IS_ABSOLUTE_API_PATH) {
        API_BASE_URL = JSON.stringify(PROJECT_CONFIG.API_BASE_URL);
    }

    if (!options.IS_FAST_MODE) {
        cssOptimisation = new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        });
    } else {
        cssOptimisation = new CssoWebpackPlugin();
    }

    const plugins = [
        new CaseSensitivePathsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('Some Random Version'), // This Returns a String else 'PURE TEXT WITHOUT  quote'
            ASSETS_PUBLIC_PATH: JSON.stringify(`/${options.APP_PUBLIC_PATH}/assets`),
            IS_MOCK_SERVER: options.IS_MOCK_SERVER,
            API_BASE_URL,
            APP_PUBLIC_PATH: JSON.stringify(options.APP_PUBLIC_PATH),
            IS_DEV: !options.IS_PRODUCTION_MODE
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        options.extractCSS,
        cssOptimisation,
        new CopyWebpackPlugin([
            {
                from: PROJECT_CONFIG.ASSETS_SRC,
                to: ''
            }
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new assembleWebpack.AttachedPlugin({
            baseLayout: [`${HANDLEBARS_DIR}/layouts/*.hbs`],
            basePages: [`${HANDLEBARS_DIR}/pages/**/*.hbs`],
            partialsLayout: [`${HANDLEBARS_DIR}/fe-components/**/*.hbs`],
            partialsData: [
                `${HANDLEBARS_DIR}/fe-components/**/*.json`,
                `${HANDLEBARS_DIR}/layouts/**/*.json`,
                `${HANDLEBARS_DIR}/pages/**/*.json`,
                `${HANDLEBARS_DIR}/data/**/*.json`
            ],
            helpers: `${JS_LIB}/utils/handlebars-helpers.js`
        }),
        new VueLoaderPlugin(),
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                // browse to http://localhost:3000/ during development
                host: '0.0.0.0',
                port: 3000,

                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                proxy: 'http://localhost:6565/'
            },
            // plugin options
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false,
                open: false
            }
        )
    ];

    if (options.IS_ANALYSE_BUILD) {
        plugins.push(
            new Visualizer({
                filename: '../build-analysis/statistics.html'
            })
        );
    }

    return plugins;
};
