{
  let $$ = (selector) => document.querySelectorAll(selector);

  let dataPopup = (el) => {
    el.setAttribute('data-popup', 'Copied!');
    setTimeout(() => el.removeAttribute('data-popup'), 2000);
  };

  let copyCodeHandler = async (event) => {
    let button = event.target;
    let code = button.closest('pre')?.querySelector('code');

    if (code) {
      let selection = getSelection();
      let range = document.createRange();

      navigator.clipboard.writeText(code.textContent);
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      dataPopup(button);
    }
  };

  let clipboard = (event) => {
    let el = event.target?.closest('[data-clipboard]');

    if (el) {
      navigator.clipboard.writeText(el.dataset.clipboard);
      dataPopup(el);
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

  $$('[data-clipboard]').forEach((i) => {
    i.addEventListener('click', clipboard);
  });

  requestIdleCallback(() => {
    let prefetched = new Set();

    let prefetch = (url) => {
      if (!prefetched.has(url) && prefetched.size < 25) {
        let link = document.createElement('link');

        link.rel = 'prefetch';
        link.href = new URL(url, location).href;

        prefetched.add(url);
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
      if (a.origin === location.origin && a.pathname !== location.pathname) {
        observer.observe(a);
      }
    });
  }, { timeout: 2000 });
}
