$(function() {
  // init smooth scrolling of inner-page links
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - $(".home-menu").outerHeight())
        }, 1000);
        return false;
      }
    }
  });

  // set height of splash and offset of content wrapper so mobile url bar doesn't cause resizing on scroll
  $(".splash-container").outerHeight($(".splash-container").outerHeight());
  $(".content-wrapper").css("top", $(".content-wrapper").offset().top);
});
