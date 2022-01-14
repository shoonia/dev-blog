requestIdleCallback(() => {
  let getId = () => {
    if (!localStorage.cid) {
      localStorage.cid = Math.random().toString(36);
    }

    return localStorage.cid;
  };

  let serialize = (ops) => {
    let data = [], key;

    for (key in ops) {
      data.push(key + '=' + encodeURIComponent(ops[key]));
    }

    return data.join('&');
  };

  let prefetched = new Set();

  let prefetch = (url) => {
    if (!prefetched.has(url) && prefetched.size < 25) {
      prefetched.add(url);

      let link = document.createElement('link');

      link.rel = 'prefetch';
      link.href = new URL(url, location.href).href;

      document.head.append(link);
    }
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        prefetch(entry.target.href);
      }
    });
  }, {
    threshold: 0,
  });

  document.querySelectorAll('a').forEach((a) => {
    if (a.hostname === location.hostname && !~a.href.indexOf('#')) {
      observer.observe(a);
    }
  });

  navigator.sendBeacon('https://www.google-analytics.com/collect',
    serialize({
      v: '1',
      ds: 'web',
      tid: 'UA-137813864-1',
      cid: getId(),
      t: 'pageview',
      dr: document.referrer,
      dt: document.title,
      dl: location.origin + location.pathname,
      ul: navigator.language.toLowerCase(),
      sr: screen.width + 'x' + screen.height,
      vp: visualViewport.width + 'x' + visualViewport.height,
    }),
  );
}, {
  timeout: 2000,
});
