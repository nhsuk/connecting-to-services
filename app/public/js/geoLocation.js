(() => {
  const geoLocate = document.querySelector('.geo-locate');
  const geoLocateDenied = document.querySelector('.geo-locate--denied');
  const geoLocateError = document.querySelector('.geo-locate--error');
  const geoLocateLocate = document.querySelector('.geo-locate--locate');
  const geoLocateSearching = document.querySelector('.geo-locate--searching');

  function error(e) {
    switch (e.code) {
      case e.PERMISSION_DENIED:
        geoLocate.style.display = 'none';
        geoLocateDenied.style.display = 'block';
        break;
      case e.POSITION_UNAVAILABLE:
        geoLocateError.style.display = 'block';
        break;
      case e.TIMEOUT:
        geoLocateError.style.display = 'block';
        break;
      default:
        geoLocateError.style.display = 'block';
    }
    geoLocateSearching.style.display = 'none';
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

  if (navigator.geolocation && geoLocate) {
    geoLocate.style.display = 'block';

    geoLocateLocate.addEventListener('click', (e) => {
      geoLocateError.style.display = 'none';
      navigator.geolocation.getCurrentPosition(success, error);
      geoLocateSearching.style.display = 'block';
      e.preventDefault();
    });
  }
})(window);
