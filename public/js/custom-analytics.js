jQuery(function($) {

  console.log('Start custom analytics');

  // Debug flag
  var debugMode = false;

  // Default time delay before checking location
  var callBackTime = 100;

  // # px before tracking a reader
  var readerLocation = 150;

  // Set some flags for tracking & execution
  var timer = 0;
  var scroller = false;
  var endNearest = false;
  var endNearby = false;
  var didComplete = false;

  // Set some time variables to calculate reading time
  var startTime = new Date();
  var beginning = startTime.getTime();
  var totalTime = 0;

  // Get some information about the current page
  var pageTitle = document.title;

  // Track the aticle load
  if (!debugMode) {
      //ga('send', 'event', 'Reading', 'ArticleLoaded', '');

  } else {
      alert('The page has loaded. Woohoo.');
  }

  // Check the location and track user
  function trackLocation() {
      bottom = $(window).height() + $(window).scrollTop();
      height = $(document).height();

      // If user starts to scroll send an event
      if (bottom > readerLocation && !scroller) {
          currentTime = new Date();
          scrollStart = currentTime.getTime();
          timeToScroll = Math.round((scrollStart - beginning) / 1000);
          if (!debugMode) {
              console.log('started reading ' + timeToScroll);
              ga('send', 'event', 'Started reading', timeToScroll+'s');
          } else {
              alert('started reading ' + timeToScroll);
          }
          scroller = true;
      }

      // If user has hit the bottom of the 'Nearest open pharmacy' send an event
      if (bottom > $('.results__item--nearest').offset().top + $('.results__item--nearest').outerHeight() && !endNearest) {
          currentTime = new Date();
          NearestScrollEnd = currentTime.getTime();
          timeToNearestEnd = Math.round((NearestScrollEnd - scrollStart) / 1000);
          if (!debugMode) {
              ga('send', 'event', 'Reached "Nearest open pharmacy" bottom', timeToNearestEnd+'s');
          } else {
              alert('end nearest pharmacy section '+timeToNearestEnd);
          }
          endNearest = true;
      }

      // If user has hit the bottom of the 'Nearby open pharmacy' send an event
      if (bottom >= $('.results__nearby').offset().top + $('.results__nearby').outerHeight() && !endNearby) {
          currentTime = new Date();
          NearbyScrollEnd = currentTime.getTime();
          timeToNearbyEnd = Math.round((NearbyScrollEnd - scrollStart) / 1000);
          if (!debugMode) {
              ga('send', 'event', 'Reached "Other pharmacies nearby" bottom', timeToNearbyEnd+'s');
          } else {
              alert('end nearby pharmacies section '+timeToNearbyEnd);
          }
          endNearby = true;
      }

      // If user has hit the bottom of page send an event
      if (bottom >= height && !didComplete) {
          currentTime = new Date();
          end = currentTime.getTime();
          totalTime = Math.round((end - scrollStart) / 1000);
          if (!debugMode) {
              /*if (totalTime < 6) {
                  _gaq.push(['_setCustomVar', 5, 'ReaderType', 'Scanner', 2]);
              } else {
                  _gaq.push(['_setCustomVar', 5, 'ReaderType', 'Reader', 2]);
              }*/
              ga('send', 'event', 'Reached page bottom', totalTime+'s');
          } else {
              alert('bottom of page '+totalTime);
          }
          didComplete = true;
      }
  }

  // Track the scrolling and track location
  $(window).scroll(function() {
      if (timer) {
          clearTimeout(timer);
      }

      // Use a buffer so we don't call trackLocation too often.
      timer = setTimeout(trackLocation, callBackTime);
  });

  // Track Telephone number click
  $('.results__phone span').on('click', function(){
    var pharmName = $(this).parent().siblings('.results__name').text();
    ga('send', 'event', 'Phone number clicked', 'Pharmacy: ' + pharmName + ' | Number: ' + $(this).text());
    //console.log('Pharmacy: ' + pharmName + ' | Number: ' + $(this).text());
  });
});
