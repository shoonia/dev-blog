/* eslint-env browser */
/* global ga */

((doc) => {
  const script = doc.createElement('script');

  script.async = true;
  script.src = 'https://www.google-analytics.com/analytics.js';
  script.onload = () => {
    ga('create', 'UA-137813864-1', 'auto', {});
    ga('send', 'pageview', doc.location.pathname);
    script.onload = null;
  };

  doc.head.appendChild(script);
})(document);
