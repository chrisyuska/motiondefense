var splashAnimator;

$(function() {
  // init smooth scrolling of inner-page links
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - $(".navbar-fixed").outerHeight())
        }, 1000);
        return false;
      }
    }
  });

  // set height of splash and offset of content wrapper so mobile url bar doesn't cause resizing on scroll
  resizeSplash();

  // transition splash image brightness in slowly
  splashAnimator = new SplashAnimator($("canvas#shade"));
  splashAnimator.start();

  $(window).resize(function() {
    resizePlatformIcons();
    resizeSplash();
    resizeFeaturette();
  });

  $(".featurette img").load(function() {
    resizeFeaturette();
  });

  resizeFeaturette();
  resizeFeaturette();

  resizePlatformIcons();
});

function resizeSplash() {
  $(".splash-container").outerHeight($(".splash-container").outerHeight());
  $(".content-wrapper").css("top", $(".content-wrapper").offset().top);

  // make sure splash animator updates measurements correctly
  if (splashAnimator) {
    splashAnimator.updateMeasurements();

    // must draw immediately aftr updating measurements to prevent jank
    splashAnimator.drawRec();
  }
}

function resizeFeaturette() {
  if ($(".platform-icons").css("min-width") == "1px") {
    var heights = $(".featurette img").map(function() { return $(this).outerHeight(); });
    var height = Math.max(...heights);
    $(".featurette .row").each(function() {
      $(this).find("img").parent().outerHeight(height);
      var adjHeight = (height - $(this).find(".featurette-content").outerHeight()) / 2;
      $(this).find(".content-head").parent().css("padding-top", adjHeight + "px");
    });
  } else {
    $(".featurette .row").each(function() {
      $(this).find("img").parent().outerHeight("");
      $(this).find(".content-head").parent().css("padding-top", "");
    });
  }
}

function resizePlatformIcons() {
  if ($(".platform-icons").css("min-width") == "1px") {
    // get content's height minux margin
    var contentHeight = $(".platform-content").parent().outerHeight() - 20;
    $(".platform-icons").css("padding", 0)
      .css("line-height", contentHeight + "px")
      .css("margin-top", "20px")
      .outerHeight(contentHeight);
  } else {
    $(".platform-icons").css("padding", "")
      .css("line-height", "")
      .css("margin-top", "")
      .outerHeight("");
  }
}

// class to handle animating splash image to look like a camera
function SplashAnimator(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.get(0).getContext("2d");

  this.updateMeasurements();

  this.fps = 60;
  this.interval = null;
  this.recTimeout = null;
  this.step = 0.002;
  this.started = false;
  this.isRec = false;
  this.recPadding = 20;
  this.recOffset = $(".navbar-fixed").outerHeight() + this.recPadding;
  this.lineWidth = 2;
}

SplashAnimator.prototype.updateMeasurements = function() {
  this.canvas.attr("width", this.canvas.outerWidth());
  this.canvas.attr("height", this.canvas.outerHeight());
  this.canvasWidth = this.canvas.outerWidth();
  this.canvasHeight = this.canvas.outerHeight();
  this.recLineLength = Math.min(this.canvasWidth, this.canvasHeight) / 3;

  this.fontSize = parseInt($("body").css("font-size").match(/[0-9]+/));
  this.ctx.font = this.fontSize + "px Roboto";
  this.recRadius = this.fontSize * 0.4;
  this.textWidth = this.ctx.measureText("REC").width;
};

SplashAnimator.prototype.start = function() {
  this.draw();
  this.setRec();
};

SplashAnimator.prototype.stop = function() {
  var _this = this;
  window.clearTimeout(_this.interval);
  window.clearTimeout(_this.recTimeout);
};

SplashAnimator.prototype.draw = function() {
  this.drawRec();

  if (!this.started) {
    this.started = true;
  }

  var _this = this;
  this.interval = window.setTimeout(function() { _this.draw() }, 1000 / _this.fps);
};

SplashAnimator.prototype.drawRec = function() {
  this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  if (this.isRec) {
    this.ctx.fillStyle = 'rgba(255,0,0,' + 0.8 + ')';
    this.ctx.fillText("REC",
        this.canvasWidth - this.textWidth - this.recPadding * 1.5,
        this.recOffset + this.fontSize + this.recPadding * 0.5);

    this.ctx.beginPath();
    this.ctx.arc(this.canvasWidth - this.textWidth - this.recPadding * 1.3 - this.recRadius * 2,
        this.recOffset + this.fontSize * 1.05 - this.recRadius + this.recPadding * 0.5,
        this.recRadius,
        0, 2 * Math.PI);
    this.ctx.fill();
  }

    this.ctx.strokeStyle = 'rgba(255,255,255,' + 0.8 + ')';
    //ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();

    // top left corner
    this.ctx.moveTo(this.recPadding, this.recOffset + this.recLineLength);
    this.ctx.lineTo(this.recPadding, this.recOffset);
    this.ctx.lineTo(this.recPadding + this.recLineLength, this.recOffset);

    // top right corner
    this.ctx.moveTo(this.canvasWidth - this.recLineLength - this.recPadding, this.recOffset);
    this.ctx.lineTo(this.canvasWidth - this.recPadding, this.recOffset);
    this.ctx.lineTo(this.canvasWidth - this.recPadding, this.recOffset + this.recLineLength);

    // bottom right corner
    this.ctx.moveTo(this.canvasWidth - this.recPadding,
                    this.canvasHeight - this.recLineLength - this.recPadding);
    this.ctx.lineTo(this.canvasWidth - this.recPadding,
                    this.canvasHeight - this.recPadding);
    this.ctx.lineTo(this.canvasWidth - this.recLineLength - this.recPadding,
                    this.canvasHeight - this.recPadding);

    // bottom left corner
    this.ctx.moveTo(this.recPadding + this.recLineLength,
                    this.canvasHeight - this.recPadding);
    this.ctx.lineTo(this.recPadding,
                    this.canvasHeight - this.recPadding);
    this.ctx.lineTo(this.recPadding,
                    this.canvasHeight - this.recLineLength - this.recPadding);

    // put it down!
    this.ctx.stroke();

    // add a timestamp
    var time = (new Date()).toLocaleTimeString();
    var timeWidth = this.ctx.measureText(time).width;
    this.ctx.fillStyle = 'rgba(255,255,255,' + 0.8 + ')';
    this.ctx.fillText(time,
                      this.canvasWidth - timeWidth - this.recPadding * 1.5 - this.lineWidth,
                      this.canvasHeight - this.recPadding * 1.5 - this.lineWidth);
};

SplashAnimator.prototype.setRec = function() {
  this.isRec = !this.isRec;
  var _this = this;
  this.recTimeout = window.setTimeout(function() { _this.setRec() }, (_this.isRec ? 500 : 1000));
};
