import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const SuccessPage = () => (
  <Layout>
    <Helmet title={'thanks for contacting'} />
    <Header title="Thanks for your contacting"></Header>
    <Container center={{center:"true"}}>
    <h3>Thanks for your submission!</h3>
    <p>We will follow up if needed.</p>
    </Container>
  </Layout>
);

export default SuccessPage;
