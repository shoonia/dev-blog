import T from 'prop-types';

import Document from '../../components/Document';
import Markdown from '../../components/Markdown';
import Time from '../../components/Time';
import { Page } from '../../components/Page';

function Post({ meta, html }) {
  return (
    <Document meta={meta}>
      <Page>
        <Time
          lang={meta.lang}
          date={meta.date}
        />
        <Markdown html={html} />
      </Page>
    </Document>
  );
}

Post.propTypes = {
  meta: T.shape().isRequired,
  html: T.string.isRequired,
};

export default Post;
