'use strict';

const multer = require('@koa/multer');
const Resumer = require('./resumer');
const uploader = multer();

const resumer = new Resumer('');

let counter = 0;

const upload = async ctx => {
  const { file, body } = ctx.request;

  console.log('>>>>> Counter: ', ++counter);

  const status = await resumer.upload({
    files: [file],
    body,
  });

  ctx.status = status;
};

module.exports = Router => {
  const router = new Router({
    prefix: `/upload`,
  });

  router.post('/', uploader.single('file'), upload);

  return router;
};
