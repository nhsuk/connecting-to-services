(function (global) {
  'use strict';
  var $ = global.jQuery;
  var $geoLocate = $('.geo-locate');
  var $geoLocateError = $('.geo-locate--error');
  var $geoSearching = $('.geo-locate--searching');
  var window = global;

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    if (latitude && longitude) {
      var locationDescription = 'my location';
      var location = './results?location=' + encodeURIComponent(locationDescription) + '&latitude=' + latitude + '&longitude=' + longitude;
      // load the results page
      window.location = location;
    } else {
      error();
    }
  }

  function error() {
    $geoSearching.hide();
    $geoLocateError.show();
  }

  if (navigator.geolocation) {
    $geoLocate.show();

    $geoLocate.on('click', function() {
      $geoLocateError.hide();
      navigator.geolocation.getCurrentPosition(success, error);
      $geoSearching.show();
    });
  }
})(window);
