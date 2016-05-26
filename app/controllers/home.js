var express = require('express'),
  router = express.Router(),
  http = require('http'),
  util = require('util');


var getGpDetails = function getGpDetails (url, callback) {

    http.get(url, function(res){

    var body = '';
  
    res.on('data', function(chunk){
        body += chunk;
    });
  
    res.on('end', function(){
      callback( JSON.parse(body) );
    });
  }).on('error', function(e){
  	console.log("Got an error: ", e);
  });

}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/gpdetails/:gpId', function (req, res, next) {
    var url = getSyndicationUrl(req);
    getGpDetails(url, render(res));
});

var render = ( function(r) {

  return function(response) {
    r.render('index', {
      title: 'Connecting 2 Services',
      gpDetails:  response
    });
  };
});

var getSyndicationUrl = function (req) {
    var url = util.format(
      'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/%s.json?apikey=%s',
      req.params.gpId,
      req.query.apikey);
    console.log(url);
    return url;
}
