const useDate = (date, lang) => {
  const time = new Date(date);

  if (time.toString() === 'Invalid Date') {
    return {};
  }

  return {
    label: time.toLocaleString(lang, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    a11y: time.toLocaleString(lang, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    iso: time.toISOString(),
  };
};

export default useDate;
