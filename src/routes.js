const Router = require('koa-router');

const router = new Router();

const userController = require('./controllers/userController');

router.post('/user/create', userController.create);
router.patch('/user/update', userController.update);
router.get('/users', userController.readAll);
router.delete('/user/delete', userController.delete);
router.get('/user/read', userController.read);

module.exports = router;