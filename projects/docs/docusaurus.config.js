// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.nightOwlLight;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ngx-schematics-utilities',
    url: 'https://dsi-hug.github.io',
    tagline: 'Useful utilities for Angular Schematics',
    baseUrl: '/ngx-schematics-utilities/',
    organizationName: 'DSI-HUG',
    projectName: 'ngx-schematics-utilities',
    deploymentBranch: 'gh-pages',
    trailingSlash: false,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    i18n: {
        defaultLocale: 'en-US',
        locales: ['en-US']
    },
    themes: [
        [
            require.resolve('@easyops-cn/docusaurus-search-local'),
            /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
            {
                docsRouteBasePath: '/',
                hashed: true,
                language: 'en',
                searchBarShortcut: false
            }
        ]
    ],
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    breadcrumbs: false,
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/dsi-hug/ngx-schematics-utilities/edit/main/docs/'
                },
                theme: {
                    customCss: [
                        require.resolve('./src/css/custom.css'),
                        require.resolve('./src/css/search.css')
                    ]
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'ngx-schematics-utilities',
                hideOnScroll: false,
                logo: {
                    alt: 'logo',
                    src: 'img/logo.svg'
                },
                items: [{
                    href: 'https://github.com/dsi-hug/ngx-schematics-utilities',
                    label: ' ',
                    position: 'right',
                    className: 'header-github-link',
                    'aria-label': 'GitHub repository'
                }]
            },
            footer: {
                style: 'dark',
                links: [{
                    title: 'Docs',
                    items: [{
                        label: 'Installation',
                        to: '/'
                    }, {
                        label: 'APIs',
                        to: '/apis/core'
                    }]
                }, {
                    title: 'Community',
                    items: [{
                        label: 'Stack Overflow',
                        href: 'https://stackoverflow.com/questions/tagged/ngx-schematics-utilities'
                    }]
                }, {
                    title: 'More',
                    items: [{
                        label: 'GitHub',
                        href: 'https://github.com/dsi-hug/ngx-schematics-utilities'
                    }]
                }],
                copyright: 'Copyright © 2021 HUG'
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['bash', 'diff', 'json']
            }
        })
};

module.exports = config;
