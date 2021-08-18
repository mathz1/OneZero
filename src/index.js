//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes')

const koa = new Koa();

koa.use(bodyParser());

koa
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = koa;