$(document).on('click', '#swap-dark', function () {
  $('link[href$="-theme.css"]').attr('href', 'assets/css/dark-theme.css');
});
$(document).on('click', '#swap-default', function () {
  $('link[href$="-theme.css"]').attr('href', 'assets/css/default-theme.css');
});

$(document).ready(function () {

  "use strict";

  /* Replace all SVG images with inline SVG */
  // 'img.svg' 'img[src$=".svg"]'
  jQuery('img[src$=".svg"]').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });

  jQuery('.totop').click(function () {
    jQuery('body,html').stop(false, false).animate({
      scrollTop: 0
    }, 800);
    return false;
  });

});
