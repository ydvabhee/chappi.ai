import type { Manifest } from 'webextension-polyfill';
import pkg from '../package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: 'src/pages/options/index.html',
  },
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'brain_32x32.png',
  },
  // rewrite newtab content to custom page
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html',
  // },
  devtools_page: 'src/pages/devtools/index.html',
  // @ts-ignore
  side_panel: {
    default_path: "src/pages/panel/index.html",
  },
  icons: {
    '128': 'brain_128x128.png',
    '512': 'brain_512x512.png'
  },
  permissions: ["scripting", "activeTab", "tabs", "sidePanel", "storage"],
  "host_permissions": ["*://*/*"],
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/content/index.js'],
      css: ['contentStyle.css'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['contentStyle.css', 'brain_512x512.png', 'brain_128x128.png'],
      matches: [],
    },
  ],
};

export default manifest;
