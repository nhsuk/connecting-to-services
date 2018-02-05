(function (global) {
  'use strict';
  var $ = global.jQuery;
  var $geoLocate = $('.geo-locate');
  var $geoLocateDenied = $('.geo-locate--denied');
  var $geoLocateError = $('.geo-locate--error');
  var $geoLocateLocate = $('.geo-locate--locate');
  var $geoLocateSearching = $('.geo-locate--searching');
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
        $geoLocateDenied.show();
        break;
      case e.POSITION_UNAVAILABLE:
        $geoLocateError.show();
        break;
      case e.TIMEOUT:
        $geoLocateError.show();
        break;
    }
    $geoLocateSearching.hide();
  }

  if (navigator.geolocation) {
    $geoLocate.show();

    $geoLocateLocate.on('click', function(e) {
      $geoLocateError.hide();
      navigator.geolocation.getCurrentPosition(success, error);
      $geoLocateSearching.show();
      e.preventDefault();
    });
  }
})(window);
