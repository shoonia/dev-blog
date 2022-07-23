{
  let $$ = (selector) => document.querySelectorAll(selector);

  let serialize = (ops) => {
    let data = [], key;

    for (key in ops) {
      data.push(key + '=' + encodeURIComponent(ops[key]));
    }

    return data.join('&');
  };

  let copyCodeHandler = async (event) => {
    let button = event.target;
    let code = button.closest('pre')?.querySelector('code');

    if (code) {
      let selection = getSelection();
      let range = document.createRange();

      navigator.clipboard.writeText(code.innerText);
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy Code', 2000);
    }
  };

  let showHint = (event) => {
    event.target.toggleAttribute('data-open');
  };

  let fullscreenHandler = (event) => {
    let pre = event.target?.closest('pre');

    if (pre) {
      pre.toggleAttribute('data-fullscreen');
      document.body.toggleAttribute('data-noscroll');
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      $$('[data-fullscreen]').forEach((el) => {
        el.removeAttribute('data-fullscreen');
      });
      document.body.removeAttribute('data-noscroll');
    }
  });

  $$('[data-copy]').forEach((button) =>
    button.addEventListener('click', copyCodeHandler),
  );

  $$('abbr[title]').forEach((abbr) => {
    abbr.addEventListener('click', showHint);
  });

  $$('[data-expand]').forEach((button) => {
    button.addEventListener('click', fullscreenHandler);
  });

  requestIdleCallback(() => {
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

    $$('a').forEach((a) => {
      if (a.hostname === location.hostname && !~a.href.indexOf('#')) {
        observer.observe(a);
      }
    });
  }, { timeout: 2000 });

  navigator.sendBeacon('https://www.google-analytics.com/collect',
    serialize({
      v: '1',
      ds: 'web',
      tid: 'UA-137813864-1',
      cid: localStorage.cid || (localStorage.cid = Math.random().toString(36)),
      t: 'pageview',
      dr: document.referrer,
      dt: document.title,
      dl: location.origin + location.pathname,
      ul: navigator.language.toLowerCase(),
      sr: screen.width + 'x' + screen.height,
      vp: visualViewport.width + 'x' + visualViewport.height,
    }),
  );
}
