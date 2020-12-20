'use strict';

const multer = require('@koa/multer');
const path = require('path');
const Resumer = require('./resumer');

const savePath = path.join(__dirname, '../../out');

const storage = multer.diskStorage({
  destination: savePath,
});
const uploader = multer({
  storage,
});

const resumer = new Resumer(savePath);

const upload = async ctx => {
  const { file, body } = ctx.request;
  try {
    const status = await resumer.upload({
      file,
      body,
    });

    ctx.body = '';
    ctx.status = status;
  } catch (e) {
    ctx.body = e;
    ctx.status = e;
  }
};

module.exports = Router => {
  const router = new Router({
    prefix: `/upload`,
  });

  router.post('/', uploader.single('file'), upload);

  return router;
};
