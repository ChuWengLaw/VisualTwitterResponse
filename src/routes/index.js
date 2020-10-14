const express = require('express');
const axios = require('axios');
const https = require('https');
const logger = require('morgan');
const router = express.Router();

//write to file delete if not needed
var fs = require('fs');



router.use(logger('tiny'));

const Twit = require('twit')

const OWMKey = '2d3a57bc337ad27b64c0af674c72edbd';
var T = new Twit({
  consumer_key: '8DEciTD5bVy4HQdSIXRevYFZI',
  consumer_secret: 'lW1I6Sc3xMxDv8QNqz3Pbefe5ANbVTa91ldonJFxpii95IVHAv',
  access_token: '1072388204534292480-4f6rYbuBeZ9r00Ry6xkaa5bW2Qj5eX',
  access_token_secret: '0qdK02JjKNjerysctpWgVFUU3Dvn1jJqwtmsIr1uiJICS',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL: true,     // optional - requires SSL certificates to be valid.
})
var rsp;
var Location = 'Australia';
/* Render home page. */
router.get('/', (req, res) => {
  var CityName_URL = `http://api.openweathermap.org/data/2.5/weather?q=${Location}&appid=${OWMKey}`
  axios.get(CityName_URL)
    .then((response) => {
      const rsp = response.data;

      T.get('trends/closest', { lat: rsp.coord.lat, long: rsp.coord.lon }, function (err, data, response) {
        var Location_WoeID = data[0].woeid
        T.get('trends/place', { id: Location_WoeID }, function (err, data, response) {


          var mystring = JSON.stringify(data);
          mystring = mystring.split('#').join('');
          data = JSON.parse(mystring);



          ChartURL = `https://quickchart.io/chart?c={type:'bar',data:{labels:[`
          for (var i = 0; i < data[0].trends.length; i++) {
            if (data[0].trends[i].tweet_volume != null) {
              ChartURL = ChartURL + `'` + data[0].trends[i].name + `'` + `,`;
            }
          }
          ChartURL = ChartURL.slice(0, -1)


          ChartURL = ChartURL + `],datasets:[{label:'Users',data:[`
          for (var i = 0; i < data[0].trends.length; i++) {
            if (data[0].trends[i].tweet_volume != null) {
              ChartURL = ChartURL + data[0].trends[i].tweet_volume + `,`;
            }
          }
          ChartURL = ChartURL.slice(0, -1)
          ChartURL = ChartURL + `]}]}}`;

          console.log(ChartURL);

          for (var i = 0; i < data[0].trends.length; i++) {
            if (data[0].trends[i].tweet_volume != 'null') {

              console.log(data[0].trends[i]);
            }
          }
          //console.log(data[0].trends);
        })
      })
    });


  res.render('index');
});

module.exports = router;