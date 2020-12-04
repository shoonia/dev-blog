import React from 'react';
import { graphql } from 'gatsby';
import T from 'prop-types';

import Main from '../layouts/Main';

export const query = graphql`
{
  allMarkdownRemark(
    limit: 10
    sort: {
      fields: [frontmatter___date]
      order: DESC
    }
    filter: {
      frontmatter: {
        publish: {
          eq: true
        }
        template: {
          eq: "default"
        }
      }
    }
  ) {
    nodes {
      id
      frontmatter {
        title
        description
        path
        date
        modified
        author
        lang
      }
    }
  }
  site {
    siteMetadata {
      title
      description
      author
      url: siteUrl
    }
  }
}`;

function IndexPage({
  data: {
    allMarkdownRemark: {
      nodes,
    },
    site: {
      siteMetadata,
    },
  },
}) {
  return (
    <Main
      nodes={nodes}
      meta={siteMetadata}
    />
  );
}

IndexPage.propTypes = {
  data: T.shape().isRequired,
};

export default IndexPage;
