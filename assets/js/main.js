AOS.init({
  duration: 800,
  easing: "slide",
  once: true
});

//checkbox filter

jQuery(document).ready(function($) {
  "use strict";

  $("#searchForm").on("submit", function(event) {
    // event.preventDefault();
    var $searchInput = event.target.children[0].value;
    let $checkboxes = $("input.search-ckbox");

    //record ticked filters
    let $setCkbox = new Set();
    for (let i = 0; i < $checkboxes.length; i++) {
      if ($checkboxes.iCheck("update")[i].checked) {
        $setCkbox.add($checkboxes[i].value);
      }
    }

    $.getJSON("../assets/js/data.json", function(data) {
      localStorage.removeItem("ckBox");

      let $resultTotal = [];
      let $resultSingle = {};
      //if checkAll is ticked, only search string in title and artist
      //then save result array to localStorage to load in result.html
      if ($setCkbox.has("checkAll")) {
        $resultTotal = jQuery.grep(data, function(n, i) {
          return (
            n.title.indexOf($searchInput) >= 0 ||
            n.artist.indexOf($searchInput) >= 0 ||
            n.category.indexOf($searchInput) >= 0 ||
            n.genre.indexOf($searchInput) >= 0 ||
            n.year.indexOf($searchInput) >= 0
          );
        });
        localStorage["ckBox"] = JSON.stringify($resultTotal);
        return;
      }

      if ($setCkbox.has("Rock")) {
        $resultSingle = jQuery.grep(data, function(n, i) {
          return (
            (n.title.indexOf($searchInput) >= 0 ||
              n.artist.indexOf($searchInput) >= 0 ||
              n.category.indexOf($searchInput) >= 0 ||
              n.genre.indexOf($searchInput) >= 0 ||
              n.year.indexOf($searchInput) >= 0) &&
            n.genre === "Rock"
          );
        });
        $resultTotal = jQuery.merge($resultTotal, $resultSingle);
      }

      if ($setCkbox.has("Solo")) {
        $resultSingle = jQuery.grep(data, function(n, i) {
          return (
            (n.title.indexOf($searchInput) >= 0 ||
              n.artist.indexOf($searchInput) >= 0 ||
              n.category.indexOf($searchInput) >= 0 ||
              n.genre.indexOf($searchInput) >= 0 ||
              n.year.indexOf($searchInput) >= 0) &&
            n.artist === "Solo"
          );
        });
        $resultTotal = jQuery.merge($resultTotal, $resultSingle);
      }
      if ($setCkbox.has("Band")) {
        $resultSingle = jQuery.grep(data, function(n, i) {
          return (
            (n.title.indexOf($searchInput) >= 0 ||
              n.artist.indexOf($searchInput) >= 0 ||
              n.category.indexOf($searchInput) >= 0 ||
              n.genre.indexOf($searchInput) >= 0 ||
              n.year.indexOf($searchInput) >= 0) &&
            n.artist === "Band"
          );
        });
        $resultTotal = jQuery.merge($resultTotal, $resultSingle);
      }
      if ($setCkbox.has("Year")) {
        $resultSingle = jQuery.grep(data, function(n, i) {
          return n.year.indexOf($searchInput) >= 0 && n.genre === "Year";
        });
        $resultTotal = jQuery.merge($resultTotal, $resultSingle);
      }

      localStorage["ckBox"] = JSON.stringify($resultTotal);
    });

    location.href = "../templates/result.html";
  });

  //load data in music
  $.getJSON("../assets/js/data.json", function(list) {
    list.forEach(function(obj, i) {
      if (i <= 11) {
        $(".grid").append(
          `<div class="grid-item col-sm-6 col-lg-4 mb-4 ">
          <div class="block-4 text-center border">
            <figure class="block-4-image">
              <a href="../templates/music-single.html">
              <img src="${obj.image}" alt="${obj.title}" class="img-fluid"></a>
            </figure>
            <div class="block-4-text p-4">
              <p class="h5"><a href="../templates/music-single.html" >${obj.title}</a></p>
              <p>By <a href="#!" class="mb-0">${obj.artist}</a></p>
              <span class="mb-0 float-left">Genre: ${obj.genre}</span>
              <span class="float-right"><span>Price: </span><span class="text-primary font-weight-bold">$${obj.price}</span></span>
            </div>
          </div>
        </div>`
        );
      }
    });
  });

  // load data in results if there is data in local storage
  if (localStorage["ckBox"]) {
    var results = JSON.parse(localStorage["ckBox"]);
    console.log(results);

    if (results) {
      results.forEach(function(obj, i) {
        if (i <= 11) {
          $(".result-grid").append(
            `<div class="grid-item col-sm-6 col-lg-4 mb-4 ">
              <div class="block-4 text-center border">
                <figure class="block-4-image">
                  <a href="../templates/music-single.html">
                  <img src="${obj.image}" alt="${obj.title}" class="img-fluid"></a>
                </figure>
                <div class="block-4-text p-4">
                  <p class="h5"><a href="../templates/music-single.html" >${obj.title}</a></p>
                  <p>By <a href="#!" class="mb-0">${obj.artist}</a></p>
                  <span class="mb-0 float-left">Genre: ${obj.genre}</span>
                  <span class="float-right"><span>Price: </span><span class="text-primary font-weight-bold">$${obj.price}</span></span>
                </div>
              </div>
            </div>`
          );
        }
      });
    }
  }

  //date picker
  $('input[name="event-date-picker"]').daterangepicker();

  $(function() {
    $('input[name="birthday-picker"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 10),
      locale: {
        format: "DD/MM/YYYY"
      }
    });
  });

  $(function() {
    $('[data-toggle="popover"]').popover();
  });

  $("#btnAdvSearch").popover({
    html: true,
    content: function() {
      var content = $(this).attr("data-popover-content");
      return $(content)
        .children(".popover-body")
        .html();
    }
  });

  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $("input").iCheck({
    checkboxClass: "icheckbox_flat-blue",
    radioClass: "iradio_flat-blue"
  });
  // advSearch checkboxes
  $("#checkAll").on("ifChecked", function(event) {
    $(".search-ckbox").iCheck("check");
  });
  $("#checkAll").on("ifUnchecked", function(event) {
    $(".search-ckbox").iCheck("uncheck");
  });

  $("#Music").on("ifChecked", function(event) {
    $(".music-check").iCheck("check");
  });
  $("#Music").on("ifUnchecked", function(event) {
    $(".music-check").iCheck("uncheck");
  });

  $("#Artist").on("ifChecked", function(event) {
    $(".artist-check").iCheck("check");
  });
  $("#Artist").on("ifUnchecked", function(event) {
    $(".artist-check").iCheck("uncheck");
  });

  $("#Print").on("ifChecked", function(event) {
    $(".mag-check").iCheck("check");
  });
  $("#Print").on("ifUnchecked", function(event) {
    $(".mag-check").iCheck("uncheck");
  });

  //Carousel
  var slider = function() {
    $(".nonloop-block-3").owlCarousel({
      center: false,
      items: 2,
      loop: false,
      stagePadding: 0,
      margin: 20,
      //   nav: true,
      //   navText: [
      //     '<span class="icon-arrow_back">',
      //     '<span class="icon-arrow_forward">'
      //   ],
      responsive: {
        600: {
          margin: 20,
          items: 3
        },
        1000: {
          margin: 20,
          items: 5
        },
        1200: {
          margin: 20,
          items: 5
        }
      }
    });
  };
  slider();

  var siteMenuClone = function() {
    $('<div class="site-mobile-menu"></div>').prependTo(".site-wrap");

    $('<div class="site-mobile-menu-header"></div>').prependTo(
      ".site-mobile-menu"
    );
    $('<div class="site-mobile-menu-close "></div>').prependTo(
      ".site-mobile-menu-header"
    );
    $('<div class="site-mobile-menu-logo"></div>').prependTo(
      ".site-mobile-menu-header"
    );

    $('<div class="site-mobile-menu-body"></div>').appendTo(
      ".site-mobile-menu"
    );

    $(".js-logo-clone")
      .clone()
      .appendTo(".site-mobile-menu-logo");

    $('<span class="ion-ios-close js-menu-toggle"></div>').prependTo(
      ".site-mobile-menu-close"
    );

    $(".js-clone-nav").each(function() {
      var $this = $(this);
      $this
        .clone()
        .attr("class", "site-nav-wrap")
        .appendTo(".site-mobile-menu-body");
    });

    setTimeout(function() {
      var counter = 0;
      $(".site-mobile-menu .has-children").each(function() {
        var $this = $(this);

        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find(".arrow-collapse").attr({
          "data-toggle": "collapse",
          "data-target": "#collapseItem" + counter
        });

        $this.find("> ul").attr({
          class: "collapse",
          id: "collapseItem" + counter
        });

        counter++;
      });
    }, 1000);

    $("body").on("click", ".arrow-collapse", function(e) {
      var $this = $(this);
      if (
        $this
          .closest("li")
          .find(".collapse")
          .hasClass("show")
      ) {
        $this.removeClass("active");
      } else {
        $this.addClass("active");
      }
      e.preventDefault();
    });

    $(window).resize(function() {
      var $this = $(this),
        w = $this.width();

      if (w > 768) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });

    $("body").on("click", ".js-menu-toggle", function(e) {
      var $this = $(this);
      e.preventDefault();

      if ($("body").hasClass("offcanvas-menu")) {
        $("body").removeClass("offcanvas-menu");
        $this.removeClass("active");
      } else {
        $("body").addClass("offcanvas-menu");
        $this.addClass("active");
      }
    });

    // click outisde offcanvas
    $(document).mouseup(function(e) {
      var container = $(".site-mobile-menu");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });
  };
  siteMenuClone();

  var sitePlusMinus = function() {
    $(".js-btn-minus").on("click", function(e) {
      e.preventDefault();
      if (
        $(this)
          .closest(".input-group")
          .find(".form-control")
          .val() != 0
      ) {
        $(this)
          .closest(".input-group")
          .find(".form-control")
          .val(
            parseInt(
              $(this)
                .closest(".input-group")
                .find(".form-control")
                .val()
            ) - 1
          );
      } else {
        $(this)
          .closest(".input-group")
          .find(".form-control")
          .val(parseInt(0));
      }
    });
    $(".js-btn-plus").on("click", function(e) {
      e.preventDefault();
      $(this)
        .closest(".input-group")
        .find(".form-control")
        .val(
          parseInt(
            $(this)
              .closest(".input-group")
              .find(".form-control")
              .val()
          ) + 1
        );
    });
  };
  sitePlusMinus();

  var siteSliderRange = function() {
    $(".slider-range").slider({
      range: true,
      min: 1940,
      max: 2019,
      values: [1940, 2019],
      slide: function(event, ui) {
        $(".year-range").val(ui.values[0] + " - " + ui.values[1]);
      }
    });
    $(".year-range").val(
      $(".slider-range").slider("values", 0) +
        " - " +
        $(".slider-range").slider("values", 1)
    );

    $(".price-slider-range").slider({
      range: true,
      min: 0,
      max: 200,
      values: [25, 100],
      slide: function(event, ui) {
        $(".price-range").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
    $(".price-range").val(
      "$" +
        $(".price-slider-range").slider("values", 0) +
        " - $" +
        $(".price-slider-range").slider("values", 1)
    );
  };
  siteSliderRange();

  var siteMagnificPopup = function() {
    $(".image-popup").magnificPopup({
      type: "image",
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: "mfp-no-margins mfp-with-zoom", // class to remove default margin from left and right side
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 300 // don't foget to change the duration also in CSS
      }
    });

    $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,

      fixedContentPos: false
    });
  };
  siteMagnificPopup();
});

const customSelects = document.querySelectorAll("select");
const deleteBtn = document.getElementById("delete");
const choices = new Choices("select", {
  searchEnabled: false,
  removeItemButton: true,
  itemSelectText: ""
});
for (let i = 0; i < customSelects.length; i++) {
  customSelects[i].addEventListener(
    "addItem",
    function(event) {
      if (event.detail.value) {
        let parent = this.parentNode.parentNode;
        parent.classList.add("valid");
        parent.classList.remove("invalid");
      } else {
        let parent = this.parentNode.parentNode;
        parent.classList.add("invalid");
        parent.classList.remove("valid");
      }
    },
    false
  );
}
deleteBtn.addEventListener("click", function(e) {
  e.preventDefault();
  const deleteAll = document.querySelectorAll(".choices__button");
  for (let i = 0; i < deleteAll.length; i++) {
    deleteAll[i].click();
  }
});
