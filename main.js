(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero entry animation — once per page per session, keyed by pathname.
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

  // Nav gets a single hairline shadow after 200px of scroll.
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

  // Design philosophy sticky sidenav — only active on pages with .dp-navitem elements.
  // Uses IntersectionObserver to track which step is in view. Allowed exception to the
  // no-scroll-animation rule per spec.
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
