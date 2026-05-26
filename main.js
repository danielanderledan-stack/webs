(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero entry animation — runs once per session, gated on sessionStorage.
  if (!reduced && !sessionStorage.getItem("cd_intro_seen")) {
    document.body.classList.add("intro");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("is-in");
      });
    });
    sessionStorage.setItem("cd_intro_seen", "1");
  }

  // Nav gets a single hairline shadow after 200px of scroll. Nothing else.
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
})();
