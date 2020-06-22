/* eslint-disable */
{
  const s = document.getElementById('ga-lite');

  s.onload = () => {
    galite('create', 'UA-137813864-1', 'auto');
    galite('send', 'pageview');
    s.onload = null;
  };
}
