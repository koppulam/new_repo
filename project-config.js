/*
 * Project Setting & Configuration
 * Compilation : Handlebars, Assembler, ReactJS, SCSS
 * Build Tool : Webpack v3
 */

// Application
const APP_NAME = 'General Web Design';
const APP_TITLE = 'General E-Store';
const VERSION = 'v1-0-0';

// Source Code
const SOURCE_ROOT_FOLDER = './src';

// Common JS Library/Code
const JS_LIB = `${SOURCE_ROOT_FOLDER}/lib`;

// Handlebars
const HANDLEBARS_DIR = `${SOURCE_ROOT_FOLDER}/hbs-app`;
const HBS_FE_COMPONENTS = `${HANDLEBARS_DIR}/fe-components/`;
const HBS_FE_LAYOUTS = `${HANDLEBARS_DIR}/layouts`;
const HBS_FE_PAGES = `${HANDLEBARS_DIR}/pages`;

// HBS JS Bundling - For Chunking
const HBS_DEPENDENCY_POINT = `${HANDLEBARS_DIR}/hbs-bundles`;

// Style Bundling
const STYLESHEETS = `${SOURCE_ROOT_FOLDER}/stylesheets`;

// Assets for Copying to Server
const ASSETS_SRC = `${SOURCE_ROOT_FOLDER}/assets`; // [Fonts, Images, Videos, Docs etc]

// AEM Path to copy build files
const AEM_SRC = '../ui.apps/src/main/content/jcr_root/apps/general-platform/clientlibs/main'; // [Fonts, Images, Videos, Docs etc]

// public AEM Path to copy dynamic bundled files
const PUBLIC_AEM_SRC = '/etc/clientlibs/general-platform/main/';

// public AEM Path to copy dynamic bundled files
const AEM_CHUNK_SRC = '../ui.apps/src/main/content/jcr_root/etc/clientlibs/general-platform/main/js';

// AEM Path to copy global files
const AEM_GLOBAL_SRC = '../ui.apps/src/main/content/jcr_root/apps/general-platform/clientlibs/global'; // [Fonts, Images, Videos, Docs etc]

// public AEM Path to copy global dynamic bundled files
const PUBLIC_AEM_GLOBAL_SRC = '/apps/general-platform/clientlibs/global/';


// Generated Output Folder for Distribution
const WEB_ROOT = 'www-root'; // Serve this folder in webpack-dev-server [Include Mock JSON here]

// Mock API data root
const MOCK_ROOT = 'mock';

// Generated output folder name for respective file types
const OUTPUT_JS_FOLDER = 'js';
const OUTPUT_CSS_FOLDER = 'css';
const OUTPUT_ASSETS_FOLDER = 'assets'; // Public Folder

/*
 *    /site-name  => If site is hosted on Shared Machine
 *    /           => If site is hosted on Dedicated Machine
 */
const APP_PUBLIC_PATH = 'General-eStore';

// Webpack-Dev-Server
const DEV_SERVER_HOST = 'localhost'; // Use 0.0.0.0 if wanted to access it over LAN using Machine IP address
const DEV_SERVER_PORT = 6565;
const API_BASE_URL = 'http://<HOST_NAME>:<PORT>'; // Without Ending '/'

// Extention/format to which all the handlebars files will be converted
const REQUIRED_MARKUP_FORMAT = '.htl';

module.exports = {
    APP_NAME,
    APP_TITLE,
    VERSION,
    REQUIRED_MARKUP_FORMAT,
    SOURCE_ROOT_FOLDER,
    JS_LIB,
    HANDLEBARS_DIR,
    HBS_FE_COMPONENTS,
    HBS_FE_LAYOUTS,
    HBS_FE_PAGES,
    HBS_DEPENDENCY_POINT,
    STYLESHEETS,
    ASSETS_SRC,
    WEB_ROOT,
    OUTPUT_JS_FOLDER,
    OUTPUT_CSS_FOLDER,
    OUTPUT_ASSETS_FOLDER,
    APP_PUBLIC_PATH,
    DEV_SERVER_HOST,
    DEV_SERVER_PORT,
    API_BASE_URL,
    AEM_SRC,
    MOCK_ROOT,
    PUBLIC_AEM_SRC,
    AEM_GLOBAL_SRC,
    PUBLIC_AEM_GLOBAL_SRC,
    AEM_CHUNK_SRC
};
