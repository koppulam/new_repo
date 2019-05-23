/* eslint-disable global-require */
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const PROJECT_CONFIG = require('./project-config.js');

const smp = new SpeedMeasurePlugin();

module.exports = (env = {}) => {
    console.log('>>>> env  : ', env);

    const IS_PRODUCTION_MODE = !env.dev;
    const IS_ANALYSE_BUILD = env.analyse || false;
    const IS_MOCK_SERVER = env.mock || true;
    const IS_ABSOLUTE_API_PATH = env.absoluteApiPath || false;
    const { APP_PUBLIC_PATH } = PROJECT_CONFIG;
    const IS_FAST_MODE = env.fast || false;
    const IS_GLOBAL_COMPS = env.globalComps || false;

    const extractCSS = new ExtractTextPlugin({
        filename: `${PROJECT_CONFIG.OUTPUT_CSS_FOLDER}/bundle.[name].css`,
        allChunks: true
    });

    const WEBPACK_UTILS = require('./webpack-settings/webpack-utils')({
        IS_PRODUCTION_MODE,
        IS_ANALYSE_BUILD,
        IS_MOCK_SERVER,
        IS_ABSOLUTE_API_PATH,
        APP_PUBLIC_PATH
    });

    // Webpack Entries
    const ENTRIES = require('./webpack-settings/webpack.entry')(env);

    // Webpack rules
    const RULES = require('./webpack-settings/webpack.rules')({
        IS_PRODUCTION_MODE,
        extractCSS,
        APP_PUBLIC_PATH,
        globalComps: env.globalCompsCSS
    });

    // Webpack plugins
    const PLUGINS = require('./webpack-settings/webpack.plugins')({
        IS_PRODUCTION_MODE,
        IS_ANALYSE_BUILD,
        IS_ABSOLUTE_API_PATH,
        APP_PUBLIC_PATH,
        extractCSS,
        IS_FAST_MODE
        // copyFiles
    });

    // Webpack Dev-Server
    const devServer = require('./webpack-settings/webpack.dev-server')({
        IS_MOCK_SERVER,
        APP_PUBLIC_PATH
    });

    WEBPACK_UTILS.printDetails();

    const config = smp.wrap({
        // context: resolve(PROJECT_CONFIG.SOURCE_ROOT_FOLDER),
        entry: ENTRIES,
        watchOptions: {
            ignored: env.fast ? [`${PROJECT_CONFIG.SOURCE_ROOT_FOLDER}/**/*.scss`, 'node_modules'] : []
        },
        output: {
            path: resolve(PROJECT_CONFIG.WEB_ROOT),
            filename: `${PROJECT_CONFIG.OUTPUT_JS_FOLDER}/bundle.[name].js`,
            chunkFilename: `${PROJECT_CONFIG.OUTPUT_JS_FOLDER}/bundle.[name].[hash:8].js`,
            publicPath: IS_PRODUCTION_MODE && !IS_GLOBAL_COMPS ? PROJECT_CONFIG.PUBLIC_AEM_SRC : '/',
            pathinfo: !IS_PRODUCTION_MODE
        },
        devtool: !IS_PRODUCTION_MODE ? 'cheap-module-source-map' : false,
        module: {
            rules: RULES
        },
        plugins: PLUGINS,
        resolve: {
            alias: {
                lib: resolve(PROJECT_CONFIG.JS_LIB),
                hbs: resolve(PROJECT_CONFIG.HANDLEBARS_DIR),
                'fe-components': resolve(PROJECT_CONFIG.HBS_FE_COMPONENTS),
                stylesheets: resolve(PROJECT_CONFIG.STYLESHEETS),
                components: resolve(__dirname, 'src', 'react-app', 'components'),
                constants: resolve(__dirname, 'src', 'react-app', 'constants'),
                actions: resolve(__dirname, 'src', 'react-app', 'actions'),
                config: resolve(__dirname, 'src', 'react-app', 'config'),
                services: resolve(__dirname, 'src', 'react-app', 'services'),
                types: resolve(__dirname, 'src', 'react-app', 'types'),
                'react-app': resolve(__dirname, 'src', 'react-app'),
                'react-slick': resolve(__dirname, 'src', 'lib/vendor/react-slick.min.js'),
                'react-lottie': resolve(__dirname, 'src', 'lib/vendor/react-lottie.js'),
                'react-lazyload': resolve(__dirname, 'src', 'lib/vendor/react-lazyload.js'),
                'react-contexify': resolve(__dirname, 'src', 'lib/vendor/react-contexify.js')
            },
            extensions: ['.js', '.jsx', '.scss']
        },
        stats: {
            children: false
        },
        devServer,
        cache: true
    });

    if (env && env.debug) {
        console.log('wepack.config: ', config);
    }

    return config;
};
