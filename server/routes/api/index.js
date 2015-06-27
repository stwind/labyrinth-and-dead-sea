import Router from 'express';

var router = Router()

function ping(req, res, next) {
  res.send('pong');
}

router.get('/ping', ping);

export default router;
