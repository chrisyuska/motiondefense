var canvas = $("canvas#shade");
var ctx = canvas.get(0).getContext("2d");
var initialShade = 0.4;
var shade = initialShade;
var fps = 100;
var interval = null;
var step = 0.001;
var up = false;

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

  // transition splash image brightness in slowly
  initDrawShade();
});

function initDrawShade() {
  interval = window.setInterval(drawShade, 1000 / fps);
}

function drawShade() {
  shade = shade + (up ? 1 : -1) * step;
  if (shade < 0) {
    window.clearInterval(interval);
    up = true;
    interval = window.setTimeout(initDrawShade, 6000);
  }

  if (shade > 0.6) {
    window.clearInterval(interval);
    up = false;
    interval = window.setTimeout(initDrawShade, 6000);
  }

  ctx.clearRect(0, 0, canvas.outerWidth(), canvas.outerHeight());
  ctx.fillStyle = 'rgba(0,0,0,' + shade + ')';
  ctx.fillRect (0, 0, canvas.outerWidth(), canvas.outerHeight());
}
