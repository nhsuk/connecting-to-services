(function (global) {
  'use strict';
  var $ = global.jQuery;
  var $geoLocate = $('.geo-locate');
  var $geoLocateError = $('.geo-locate--error');

  function success(position) {
    console.log(position);
    console.log('Send the coordinates to the app to get some results');
  }

  function error() {
    // $geoLocate.hide();
    $geoLocateError.show();
  }

  if (navigator.geolocation) {
    $geoLocate.show();

    $geoLocate.on('click', function() {
      navigator.geolocation.getCurrentPosition(success, error);
    });
  }
})(window);
