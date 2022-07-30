console.log('\n Start:', process.env.NODE_ENV, '\n');

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  isProd: process.env.NODE_ENV === 'production',
  debug: Boolean(process.env.DEBUG),
  dateNow: new Date(),
};
