((global) => {
  const $ = global.jQuery;
  const $geoLocate = $('.geo-locate');
  const $geoLocateDenied = $('.geo-locate--denied');
  const $geoLocateError = $('.geo-locate--error');
  const $geoLocateLocate = $('.geo-locate--locate');
  const $geoLocateSearching = $('.geo-locate--searching');
  const window = global;

  function error(e) {
    switch (e.code) {
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
      default:
        $geoLocateError.show();
    }
    $geoLocateSearching.hide();
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    if (latitude && longitude) {
      const locationDescription = 'your location';
      const location = `./results?location=${encodeURIComponent(locationDescription)}&latitude=${latitude}&longitude=${longitude}`;
      // load the results page
      window.location = location;
    } else {
      error();
    }
  }

  if (navigator.geolocation) {
    $geoLocate.show();

    $geoLocateLocate.on('click', (e) => {
      $geoLocateError.hide();
      navigator.geolocation.getCurrentPosition(success, error);
      $geoLocateSearching.show();
      e.preventDefault();
    });
  }
})(window);
