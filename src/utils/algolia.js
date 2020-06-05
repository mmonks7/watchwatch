const shopQuery = `{
  shops: allGoogleSheetListRow {
    edges {
      node {
        objectID: slug
        title: name
        slug
        date
        tags
        about
        state
        city
      }
    }
  }
}`
const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))
const settings = { attributesToSnippet: [`excerpt:10`] }
const queries = [
  {
    query: shopQuery,
    transformer: ({ data }) => flatten(data.shops.edges),
    indexName: `watchwatch`,
    settings,
  },
]
module.exports = queries
