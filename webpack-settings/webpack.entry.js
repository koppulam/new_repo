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
        'lib/jquery.sticky-navigation.js',

        // Vendor Libraries
        'lib/vendor/material-inputs.js',
        'lib/vendor/niceSelect.min.js',

        // vue
        'vue',
        'prop-types',

        'object-path',
        'lib/utils/no-focus-ada.js'
    ];

    entries.vueApp = ['./src/vue-app/index.js'];

    return entries;
};
