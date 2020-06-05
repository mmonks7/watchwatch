import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import AtomFeedList from '../components/AtomFeedList';
import '../styles/prism';

const SuggestionBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: ${props => props.theme.colors.white.dark};
  box-shadow: ${props => props.theme.shadow.suggestion};
`;
const PostSuggestion = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 3rem 0 3rem;
  @media (max-width: 600px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const Title = styled.h1`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.h5`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.7rem;
  }
`;

const Statistics = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.white.grey};
  margin-bottom: 15px;
  padding: 5px;
`;

const StatisticItem = styled.div`
  margin-right: 40px;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.6rem;
    margin-right: 10px;
  }
`;

const StatisticIcon = styled.img`
  width: 30px;
  margin-left: 7px;
  margin-top: 5px;
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, slug, imageurl, url, category, tags, localImageUrl, about, state, city } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];
  const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;


  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        banner={image}
        pathname={url}
      />
      <Header title={name} />
      <Container>
        <div style={{ display: "flex" }}>

          <div>
            <Title>{name}</Title>
            <Subtitle>{city}, {state}</Subtitle>
          </div>
        </div>
        <TagsBlock list={tagsList || []} />
        <Content input={about} /><br />
        <Content input={url} /><br />





        <a target="_blank" href={url} className="button">View on Twitter</a> <a href="/random" className="button buttonalt">See another incident</a>

      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/${prev.slug}`}>
              <h4>Previous</h4>
              <p>{prev.name}</p>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/${next.slug}`}>
              <h4>Next</h4>
              <p>{next.name}</p>
            </Link>
          )}
        </PostSuggestion>
      </SuggestionBar>
    </Layout>
  );
};

export default SingleItem;

export const query = graphql`
  query($pathSlug: String!) {
    googleSheetListRow(slug: {eq: $pathSlug}) {
      id
      name
      city
      state
      url
      media_filename
      youtube_link
      about
      slug
      imageurl
      category
    }
  }
`;
