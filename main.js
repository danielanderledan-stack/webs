(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Loader ---- */
  (function () {
    var loader = document.getElementById("loader");
    if (!loader) return;

    if (reduced || sessionStorage.getItem("cd_loaded")) {
      loader.remove();
      return;
    }

    var dots = Array.from(loader.querySelectorAll(".loader__dot"));

    // Timing constants (ms)
    var START   = 300;   // delay before dot 1 activates
    var STAGGER = 680;   // gap between each dot activation
    var PULSE   = 800;   // duration of one dot's pulse animation
    var HOLD    = 400;   // pause after last dot before sliding up
    var SLIDE   = 720;   // slide-up transition duration (matches CSS 0.72s)

    dots.forEach(function (dot, i) {
      setTimeout(function () {
        dot.classList.add("is-active");
      }, START + i * STAGGER);
    });

    var slideAt = START + (dots.length - 1) * STAGGER + PULSE + HOLD;

    setTimeout(function () {
      loader.classList.add("is-leaving");
      setTimeout(function () {
        loader.remove();
        sessionStorage.setItem("cd_loaded", "1");
      }, SLIDE + 50);
    }, slideAt);
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

  /* ---- Mobile nav toggle ---- */
  var burger = document.querySelector(".nav__burger");
  var navLinks = document.querySelector(".nav__links");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

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
