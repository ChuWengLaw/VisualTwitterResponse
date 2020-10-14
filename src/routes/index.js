const express = require('express');
const axios = require('axios');
const https = require('https');
const logger = require('morgan');
const router = express.Router();

router.use(logger('tiny'));

var Twit = require('twit')
 
var T = new Twit({
  consumer_key:         '8DEciTD5bVy4HQdSIXRevYFZI',
  consumer_secret:      'lW1I6Sc3xMxDv8QNqz3Pbefe5ANbVTa91ldonJFxpii95IVHAv',
  access_token:         '1072388204534292480-4f6rYbuBeZ9r00Ry6xkaa5bW2Qj5eX',
  access_token_secret:  '0qdK02JjKNjerysctpWgVFUU3Dvn1jJqwtmsIr1uiJICS',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
var rsp;
/* Render home page. */
router.get('/', (req, res) => {
  T.get('trends/place', { id: '1100661' }, function(err, data, response) {
    for (var i = 0; i<data[0].trends.length;i++)
    {
      if (data[0].trends[i].tweet_volume != null)
      {
        console.log(data[0].trends[i]);
      }
        
    }
    
  })
  
  res.render('index');
});

module.exports = router;