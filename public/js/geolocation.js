// TODO: code tidy! done quickly as a POC

if (navigator.geolocation) {

  $('.find-location').show(); // show the use your location button

  $('.button--uselocation').click(function(e) {
    e.preventDefault();
    var startPos;
    var geoSuccess = function(position) {
      url = 'https://api.postcodes.io/postcodes?lon=' + position.coords.longitude + '&lat=' + position.coords.latitude;
      $.get((url)).
        done(function (data) {
          postcode = data.result[0].postcode;
          $('#location').addClass('highlight').val(postcode);
        })
        .fail(function (error) {
          $('.location-error').show();
        });
    };
    var geoError = function(error) {
      $('.location-error').show();
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  });

}
