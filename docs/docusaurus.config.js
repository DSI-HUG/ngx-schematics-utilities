// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ngx-schematics-utilities',
    tagline: 'Useful utilities for Angular Schematics',
    url: 'https://dsi-hug.github.io',
    baseUrl: '/ngx-schematics-utilities/',
    organizationName: 'DSI-HUG',
    projectName: 'ngx-schematics-utilities',
    deploymentBranch: 'gh-pages',
    trailingSlash: false,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    presets: [
        [
            '@docusaurus/preset-classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/DSI-HUG/ngx-schematics-utilities/edit/main/docs/docs/'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'ngx-schematics-utilities',
                logo: {
                    alt: 'logo',
                    src: 'img/logo.svg'
                },
                items: [
                    {
                        href: 'https://github.com/DSI-HUG/ngx-schematics-utilities',
                        label: ' ',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository'
                    }
                ]
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Installation',
                                to: '/'
                            },
                            {
                                label: 'APIs',
                                to: '/apis/core'
                            }
                        ]
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/ngx-schematics-utilities'
                            }
                        ]
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/DSI-HUG/ngx-schematics-utilities'
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} HUG`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
