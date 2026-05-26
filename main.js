(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Loader ---- */
  (function () {
    var loader = document.getElementById("loader");
    if (!loader) return;

    // Skip if user prefers reduced motion OR has already seen the loader
    // this session (avoids replaying it on every in-site navigation).
    if (reduced || sessionStorage.getItem("cd_loaded")) {
      loader.remove();
      return;
    }

    var dots = Array.from(loader.querySelectorAll(".loader__dot"));
    var cover = loader.querySelector(".loader__cover");

    // Timing constants (ms)
    var START    = 300;   // delay before dot 1 activates
    var STAGGER  = 680;   // gap between each dot activation
    var PULSE    = 800;   // duration of one dot's pulse animation
    var HOLD     = 320;   // pause after last dot before cover expands
    var EXPAND   = 900;   // clip-path expansion duration (matches CSS 0.9s)
    var FADE     = 1000;  // cover opacity fade duration

    // Activate dots one by one
    dots.forEach(function (dot, i) {
      setTimeout(function () {
        dot.classList.add("is-active");
      }, START + i * STAGGER);
    });

    // When the last dot finishes, expand the cover from dot-3's centre
    var expandAt = START + (dots.length - 1) * STAGGER + PULSE + HOLD;

    setTimeout(function () {
      var dot3 = dots[dots.length - 1];
      var r = dot3.getBoundingClientRect();
      cover.style.setProperty("--cx", r.left + r.width  / 2 + "px");
      cover.style.setProperty("--cy", r.top  + r.height / 2 + "px");
      cover.classList.add("is-expanding");

      // After circle covers the screen, fade it away to reveal the site
      setTimeout(function () {
        cover.classList.add("is-fading");

        // Remove loader from DOM once fully transparent
        setTimeout(function () {
          loader.remove();
          sessionStorage.setItem("cd_loaded", "1");
        }, FADE + 80);
      }, EXPAND);
    }, expandAt);
  })();

  /* ---- Hero entry animation — once per page per session ---- */
  var storageKey = "cd_intro" + window.location.pathname.replace(/\W+/g, "_");
  if (!reduced && !sessionStorage.getItem(storageKey)) {
    document.body.classList.add("intro");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("is-in");
      });
    });
    sessionStorage.setItem(storageKey, "1");
  }

  /* ---- Nav hairline shadow after 200px scroll ---- */
  var nav = document.querySelector(".nav");
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        nav.classList.toggle("is-scrolled", window.scrollY > 200);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Design philosophy sticky sidenav ---- */
  var dpItems = document.querySelectorAll(".dp-navitem");
  if (dpItems.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            dpItems.forEach(function (item) {
              item.classList.toggle("is-active", item.dataset.target === id);
            });
          }
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    dpItems.forEach(function (item) {
      var sec = document.getElementById(item.dataset.target);
      if (sec) io.observe(sec);
    });
  }
})();
