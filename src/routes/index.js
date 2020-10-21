const express = require('express');
const axios = require('axios');
const https = require('https');
const logger = require('morgan');
const router = express.Router();
router.use(logger('tiny'));

// Persistence
var RedisClustr = require('redis-clustr');
const redis = require('redis');
require('dotenv').config();
const AWS = require('aws-sdk');

var Promise = require('es6-promise').Promise;

// Twitter
const Twit = require('twit');
const { Console } = require('console');

// Natural Language Processing
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");

// Twitter headers and params
const OWMKey = '2d3a57bc337ad27b64c0af674c72edbd';
var T = new Twit({
  consumer_key: '8DEciTD5bVy4HQdSIXRevYFZI',
  consumer_secret: 'lW1I6Sc3xMxDv8QNqz3Pbefe5ANbVTa91ldonJFxpii95IVHAv',
  access_token: '1072388204534292480-4f6rYbuBeZ9r00Ry6xkaa5bW2Qj5eX',
  access_token_secret: '0qdK02JjKNjerysctpWgVFUU3Dvn1jJqwtmsIr1uiJICS',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL: true,     // optional - requires SSL certificates to be valid.
})


// Cloud Services Set-up
// Create unique bucket name
const bucketName = 'callumlaw-twitter-store';
// Create a promise on S3 service object
const bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();
bucketPromise.then(function (data) {
  console.log("Successfully created " + bucketName);
})
  .catch(function (err) {
    console.error(err, err.stack);
  });

// ElastiCache 
const elasticachehost = "callumlawredis.km2jzi.clustercfg.apse2.cache.amazonaws.com";
const elasticacheport = "6379";

//const redisClient = redis.createClient(elasticacheport, elasticachehost);
var redisClient = new RedisClustr({
  servers: [
      {
          host: elasticachehost,
          port: elasticacheport
      }
  ],
  createClient: function (port, host) {
      // this is the default behaviour
      return redis.createClient(port, host);
  }
});

//connect to redis
redisClient.on("connect", function () {
  console.log("connected");
});

redisClient.on('error', (err) => {
  console.log("Error " + err);
});

/* Render home page. */
router.get('/', (req, res) => {
  res.render('index');
});

/* Search trending twitter posts */
router.get('/search', (req, res) => {
  var CityName_URL = `http://api.openweathermap.org/data/2.5/weather?q=${req.query.location}&appid=${OWMKey}`
  const redisKey = `twitter:${req.query.location}`;
  const s3Key = `twitter:${req.query.location}`;

  // Try the cache   
  return redisClient.get(redisKey, (err, result) => {
    if (result) {
      // Serve from Cache    
      console.log("Served from Cache");
      return res.send(result);
    } else {//check S3 
      const params = { Bucket: bucketName, Key: s3Key };
      return new AWS.S3({ apiVersion: '2006-03-01' }).getObject(params, (err, result) => {
        if (result) {
          // Serve from S3 save into cache
          console.log("Served from S3");
          //save into cache
          //S3 stores as a weird value so JSON it then string it to be compatible with redis.  
          var cacheStore = JSON.stringify(JSON.parse(result.Body));
          redisClient.setex(redisKey, 3600, cacheStore);
          return res.send(cacheStore);
        } else {
          // Serve from Wikipedia API and store in S3, and store in cache
          return axios.get(CityName_URL) //used to return longandlat
            .then((response) => {
              const rsp = response.data;
              //used to return woeid of a place
              T.get('trends/closest', { lat: rsp.coord.lat, long: rsp.coord.lon }, function (err, data, response2) {
                var Location_WoeID = data[0].woeid;
                //used to return trending name in the place
                T.get('trends/place', { id: Location_WoeID }, function (err, data2, response3) {
                  //Chart manipulation code can fit here
                  var mystring = JSON.stringify(data2);
                  mystring = mystring.split('#').join('');
                  data2 = JSON.parse(mystring);
                  var volume_trends = 0;
                  ChartURL = `https://quickchart.io/chart?c={type:'bar',data:{labels:[`
                  for (var i = 0; i < data2[0].trends.length; i++) {
                    if (data2[0].trends[i].tweet_volume != null) {
                      volume_trends = volume_trends + 1;
                      ChartURL = ChartURL + `'` + data2[0].trends[i].name + `'` + `,`;
                    }
                  }
                  ChartURL = ChartURL.slice(0, -1)

                  ChartURL = ChartURL + `],datasets:[{label:'Users',data:[`
                  for (var i = 0; i < data2[0].trends.length; i++) {
                    if (data2[0].trends[i].tweet_volume != null) {
                      ChartURL = ChartURL + data2[0].trends[i].tweet_volume + `,`;
                    }
                  }
                  ChartURL = ChartURL.slice(0, -1);
                  ChartURL = ChartURL + `]}]}}`;

                  if (volume_trends == 0)
                  {
                    ChartURL = `https://quickchart.io/chart?c={type:'bar',data:{labels:[],datasets:[{label:'No Trends to Show',data:[]}]}}`
                  }
                  var trendtopic = [];
                  var scorearr = [];
                  var avg_rate = [];
                  // search for the relevant tweets
                  Promise.all(
                    data2[0].trends.slice(0, 3).map(trend => {
                      return new Promise((resolve, reject) => {
                        T.get('search/tweets', { q: JSON.stringify(trend.name), count: 100 }, function (err, data3, response) {
                          try {                            
                            //do this first then send to ajax
                            trendtopic.push(trend.name);
                            // process the twitter with sentimental analysis
                            var rate = 0;                      
                            for (i = 0; i < 100; i++) {
                              var score = analyzer.getSentiment(tokenizer.tokenize(data3.statuses[i].text));
                              scorearr.push(score);
                              rate = rate + score;                             
                            } 
                            rate = rate/100;
                            avg_rate.push(rate);
                            resolve(data3.statuses[0].text);                            
                          } catch (err) {
                            console.log(err);
                            res.send("");                            
                          }
                        })
                      })
                    })
                  ).then(result => {
                    // push the scores into json to send to ajax
                    var JSONResult = JSON.stringify({ url: ChartURL, result, score: scorearr, topic: trendtopic, rating: avg_rate});
                    
                    // check that it serves from twitter and save in redis and S3
                    console.log("Served from Twitter");
                    const objectParams = { Bucket: bucketName, Key: s3Key, Body: JSONResult };
                    const uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
                    redisClient.setex(redisKey, 3600, JSONResult);
                    uploadPromise.then(function (data) {
                      console.log("Successfully uploaded data to " + bucketName + "/" + s3Key);
                    });

                    // send to ajax
                    return res.send(JSONResult);
                  }).catch(error => {
                    console.log(error);
                    res.send("");
                  })
                })
              })
            })
            .catch(error => {
              console.log(error);
              res.render('error', { error });
            });
        }
      });
    }
  });
});

module.exports = router;
