const Koa = require('koa');
const Router = require('koa-router');

const koa = new Koa();
const router = new Router();

const userController = require('./controllers/userController');

router.post('/user/create', userController.create);

module.exports = router;