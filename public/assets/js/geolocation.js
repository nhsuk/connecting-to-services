jQuery(function($) {
  $('.getLocation').click(function(e){
    e.preventDefault();
    if (navigator.geolocation) {
      var loadingGif = ''
      $('#location').css({

      })
      navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyBZhcdIqqt0camt-uSHAXKB-LjmsNa0DX8", function( data ) {
          var address = data.results[0].address_components,
              postcode = address[address.length - 1].long_name;
              console.log(address);
          $('#location').val(postcode)
          $('#location').after('<style>dt{display: block;}dd{display: inline-block;}</style><dl><dt>Street:</dt><dd>'+address[1].long_name+'</dd><dt>Town:</dt><dd>'+address[2].long_name+'</dd><dt>County:</dt><dd>'+address[4].long_name+'</dd></dl>')
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
});
