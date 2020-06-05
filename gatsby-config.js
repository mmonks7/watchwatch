const config = require('./config/site');
const queries = require("./src/utils/algolia");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "WatchWatch.org",
    description: "documenting unnecessary police violence",
    ...config,
  },

  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    'gatsby-plugin-react-helmet',
    {
    resolve: '@fs/gatsby-plugin-drive',
    options: {
      folderId: '1zniqs5KlQJffey_FOHDlb-Ghy0Hikl_w',
      keyFile: `${__dirname}/client_secret.json`,
      destination: `${__dirname}/content/media`,
      exportGDocs: false,
      exportMimeType: ''
      }
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              quality: 90,
              linkImagesToOriginal: true,
            },
          },

          'gatsby-remark-prismjs',
        ],
      },
    },
    {
    resolve: 'gatsby-source-google-sheets',
    options: {
        spreadsheetId: '1BlveympsddBWRld-ulhh6EH7pUT635HgvM0Jk3GlSoY',
        worksheetTitle: 'list',
        credentials: require(`${__dirname}/client_secret.json`,),
        plugins: [
          'gatsby-plugin-twitter'
        ]


      }


    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: 'googleSheetListRow',
        imagePath: 'imageurl',
        name: 'localImageUrl',
      },
    },
    {
      resolve: 'gatsby-plugin-emotion',
      options: {
        autoLabel: process.env.NODE_ENV !== 'production',
        // eslint-disable-next-line
        labelFormat: `[filename]--[local]`,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'config/typography.js',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    `gatsby-plugin-styled-components`,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.title,
        short_name: config.shortName,
        description: config.description,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: config.favicon,
      },
    },
    'gatsby-plugin-offline',
  ],
};
