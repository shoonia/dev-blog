/* eslint-disable */

((d) => {
  const s = d.createElement('script');

  s.async = true;
  s.src = 'https://static.parastorage.com/unpkg/ga-lite@2.0.5/dist/ga-lite.min.js';
  s.crossOrigin = 'anonymous';
  s.onload = () => {
    galite('create', 'UA-137813864-1', 'auto');
    galite('send', 'pageview');
    s.onload = null;
  };

  d.body.appendChild(s);
})(document);
