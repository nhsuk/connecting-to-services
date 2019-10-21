const geoLocateButton = document.querySelector('.geo-locate--button');
const geoLocateDenied = document.querySelector('.geo-locate--denied');
const geoLocateError = document.querySelector('.geo-locate--error');
const geoLocateSearching = document.querySelector('.geo-locate--searching');

const geolocationError = (e) => {
  geoLocateSearching.style.display = 'none';
  if (e.code === e.PERMISSION_DENIED) {
    geoLocateDenied.style.display = 'block';
  } else {
    geoLocateError.style.display = 'block';
  }
};

const geolocationSuccess = ({ coords: { latitude, longitude } }) => {
  if (latitude && longitude) {
    window.location = `./results?location=your%20location&latitude=${latitude}&longitude=${longitude}`;
  } else {
    geolocationError();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (geoLocateButton) {
    if ('geolocation' in navigator) {
      geoLocateButton.addEventListener('click', (e) => {
        e.preventDefault();
        geoLocateError.style.display = 'none';
        geoLocateDenied.style.display = 'none';
        geoLocateSearching.style.display = 'block';
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
      });
    } else {
      geoLocateButton.style.display = 'none';
    }
  }
});
