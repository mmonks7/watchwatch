import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';



const Shops = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  return (
    <Layout>
      <Helmet title={'Uncommon Shops'} />
      <Header title="Uncommon Shops">an ever-growing list of exceptional independent brands & retailers</Header>
      {edges.map(({ node }) => (
        <BlogList
          key={node.name}
          cover={node.localImageUrl && node.localImageUrl.childImageSharp && node.localImageUrl.childImageSharp.fluid}
          path={`/shops/${node.name}`}
          title={node.name}
          date={node.date}
          tags={node.tags.split(',')}
          excerpt={node.about}
        />
      ))}
    </Layout>
  );
};

export default Shops;

export const query = graphql`
  query {
    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          category
          tags
          sociallink
          about
          country
          state
          city
          localImageUrl {
            childImageSharp {
              fluid(
                maxWidth: 1000
                quality: 90
                traceSVG: { color: "#2B2B2F" }
              ) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
          imageurl
        }
      }
    }
  }
`;
