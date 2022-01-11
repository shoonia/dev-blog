// Google Analytics

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
    sr: window.screen.width + 'x' + window.screen.height,
    vp: window.visualViewport.width + 'x' + window.visualViewport.height,
  }),
);

// Prefetch links

let supported = (url) => {
  return new Promise((res, rej) => {
    let link = document.createElement('link');

    link.rel = 'prefetch';
    link.href = url;

    link.onload = res;
    link.onerror = rej;

    document.head.append(link);
  });
};

let toPrefetch = new Set();
let queue = [];
let hrefsInViewport = [];

let prefetch = async (url) => {
  if (!toPrefetch.has(url)) {
    toPrefetch.add(url);
    await supported(new URL(url, location.href).href);
  }
};

let run = () => queue.length > 0 && queue.shift()();
let add = (fn) => queue.push(fn) > 1 || run();

let observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry = entry.target;
      hrefsInViewport.push(entry.href);

      if (hrefsInViewport.indexOf(entry.href) === -1) {
        return;
      }

      observer.unobserve(entry);

      add(() => prefetch(entry.href).finally(run));
    }
    else {
      entry = entry.target;

      let index = hrefsInViewport.indexOf(entry.href);

      if (index > -1) {
        hrefsInViewport.splice(index);
      }
    }
  });
}, {
  threshold: 0,
});

window.requestIdleCallback(() => {
  document.querySelectorAll('a').forEach((a) => {
    if (a.hostname === location.hostname && a.href.indexOf('#') === -1) {
      observer.observe(a);
    }
  });
}, {
  timeout: 2000,
});
