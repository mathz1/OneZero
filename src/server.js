const koa = require('./index');

const port = process.env.PORT || 3000;

module.exports = koa.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});