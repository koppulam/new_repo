const fs = require('fs');
const { resolve } = require('path');

const PROJECT_CONFIG = require('../project-config.js');

module.exports = function getEntriesConfig(options) {
    const dirName = resolve(PROJECT_CONFIG.HBS_DEPENDENCY_POINT);
    const entries = {};
    const files = fs.readdirSync(dirName);

    files.forEach(file => {
        const fileNameWithoutExt = file.slice(0, file.length - 3);

        entries[fileNameWithoutExt] = `${dirName}/${file}`;
    });

    entries.vendor = [
        // Polyfill
        'babel-polyfill',
        'lib/component-register.js',
        'lib/utils/feature-detection.js',
        'lib/utils/create-modal.js',
        'lib/utils/tiffany-toast.js',
        'lib/jquery.sticky-navigation.js',

        // Vendor Libraries
        'lib/vendor/material-inputs.js',
        'lib/vendor/niceSelect.min.js',
        'lib/vendor/react-slick.js',
        'lib/vendor/react-lottie.js',
        'lib/vendor/react-lazyload.js',
        'lib/vendor/react-contexify.js',

        // React
        'react',
        'react-dom',
        // 'react-addons-css-transition-group',
        'prop-types',

        // Redux
        'redux',
        'react-redux',
        'react-responsive',
        'classnames',

        // Routing
        // 'react-router',
        // 'react-router-dom',
        // 'react-router-redux',
        'history',

        // Other packages
        // 'redux-thunk',
        // 'react-modal',
        // 'redux-logger',
        // 'redux-devtools-extension',
        // 'redux-form',
        // 'react-tap-event-plugin',

        // 'react-slick',
        // 'react-share',
        // 'react-highlight-words',
        // 'react-responsive',
        'object-path',
        'lib/utils/tiffany-ada.js'
    ];

    if (options.globalComps) {
        entries.globalReactComponents = ['./src/react-app/globalComps.js'];
    } else {
        entries.reactApp = ['./src/react-app/index.js'];

        // CSS compilation
        entries.globalStyles = ['./src/stylesheets/globals.scss', './src/clientlibs/css/global-styles.scss'];
        entries.cmsComponents = ['./src/clientlibs/css/cms-components.scss'];
        entries.browseGrid = ['./src/clientlibs/css/browse-grid.scss', './src/clientlibs/css/product-actions.scss', './src/clientlibs/css/build-your-own.scss'];
        entries.pdp = ['./src/clientlibs/css/pdp.scss', './src/clientlibs/css/product-actions.scss', './src/clientlibs/css/engagement.scss', './src/clientlibs/css/sales-service.scss'];
        entries.store = ['./src/clientlibs/css/store.scss'];
    }

    return entries;
};
