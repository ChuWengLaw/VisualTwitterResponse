const express = require('express');
const axios = require('axios');
const https = require('https');
const logger = require('morgan');
const router = express.Router();

router.use(logger('tiny'));

/* Render home page. */
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;