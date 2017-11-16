(function (global) {
  'use strict';
  var $ = global.jQuery;
  var $geoLocate = $('.geo-locate');
  var $geoLocateLocate = $('.geo-locate--locate');
  var $geoLocateError = $('.geo-locate--error');
  var $geoSearching = $('.geo-locate--searching');
  var window = global;

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    if (latitude && longitude) {
      var locationDescription = 'your location';
      var location = './results?location=' + encodeURIComponent(locationDescription) + '&latitude=' + latitude + '&longitude=' + longitude;
      // load the results page
      window.location = location;
    } else {
      error();
    }
  }

  function error(e) {
    switch(e.code) {
      case e.PERMISSION_DENIED:
        $geoLocate.hide();
        break;
      case e.POSITION_UNAVAILABLE:
        $geoLocateError.show();
        break;
      case e.TIMEOUT:
        $geoLocateError.show();
        break;
    }
    $geoSearching.hide();
  }

  if (navigator.geolocation) {
    $geoLocate.show();

    $geoLocateLocate.on('click', function() {
      $geoLocateError.hide();
      navigator.geolocation.getCurrentPosition(success, error);
      $geoSearching.show();
    });
  }
})(window);
