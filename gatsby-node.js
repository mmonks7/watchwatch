const path = require('path');
const _ = require("lodash");
const fetch = require("node-fetch");
const FeedParser = require("feedparser");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type googleSheetListRow implements Node {
      id: String
      name: String
      city: String
      state: String
      tweet_url: String
      media_filename: String
      youtube_link: String
      comment: String
      slug: String

    }
  `)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx');
    const alltagsPage = path.resolve('src/templates/alltags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');
    const categoryTemplate = path.resolve('src/templates/category.jsx');

    const postsByTag = {};

    //Start of creating pages from Google Sheet Data
    const entryTemplate = path.resolve('src/templates/singleitem.jsx');
    resolve(
      graphql(
        `
          query {
            allGoogleSheetListRow {
              edges {
                node {
                  id
                  name
                  city
                  state
                  tweet_url
                  media_filename
                  youtube_link
                  comment
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const sheetRows = result.data.allGoogleSheetListRow.edges;

        // extracting tags from pages
        sheetRows.forEach(({ node }) => {
          if (node.tags) {
            const tagsList = node.tags.split(',')
            let rowPost = {
              frontmatter: {
                title: "",
                path: ""
              }
            }
            tagsList.forEach(tag => {
              rowPost.frontmatter.title = node.name
              rowPost.frontmatter.path = '' + node.slug
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });

        // extracting categories from the page and creating seperate category pages
        let uniqueCategories = []
        sheetRows.forEach(({ node }) => {
          if (node.category) {
            const categoryList = node.category.split(',')
            categoryList.forEach(category => {
              if (uniqueCategories.indexOf(category) === -1) {
                uniqueCategories.push(category)
              }
            });
          }
        });

        // Make category pages
        uniqueCategories.forEach(cat => {
          categoryKebabCase = cat.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
          createPage({
            path: `/category/${categoryKebabCase}/`,
            component: categoryTemplate,
            context: {
              category: cat,
            },
          })
        })

        //create pages
        sheetRows.forEach(({ node }, index) => {
          const path = '/' + node.slug;
          const prev = index === 0 ? null : sheetRows[index - 1].node;
          const next =
            index === sheetRows.length - 1 ? null : sheetRows[index + 1].node;
          createPage({
            path,
            component: entryTemplate,
            context: {
              pathSlug: node.slug,
              prev,
              next,
            },
          });
        });
      })
    );
    //End of creating pages from Google Sheet Data

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark(
              sort: { order: ASC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        // create tags page
        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }

              postsByTag[tag].push(node);
            });
          }
        });

        const tags = Object.keys(postsByTag);

        //Create All Tags page
        createPage({
          path: '/alltags',
          component: alltagsPage,
          context: {
            tags: tags.sort(),
          },
        });

        //create tags
        tags.forEach(tagName => {
          const posts = postsByTag[tagName];

          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName,
            },
          });
        });

        //create posts
        posts.forEach(({ node }, index) => {
          const path = node.frontmatter.path;
          const prev = index === 0 ? null : posts[index - 1].node;
          const next =
            index === posts.length - 1 ? null : posts[index + 1].node;
          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path,
              prev,
              next,
            },
          });
        });
      })
    );

  });
};

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
