(function () {
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

  if (!hasGSAP || !hasScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  function splitHeadingWords(heading) {
    var raw = heading.textContent;
    if (!raw) return [];

    var words = raw.trim().replace(/\s+/g, " ").split(" ");
    if (!words.length) return [];

    heading.textContent = "";

    var innerSpans = [];

    words.forEach(function (word, index) {
      var outer = document.createElement("span");
      outer.className = "inline-block overflow-hidden align-top";
      outer.style.height = "1.35em";

      var inner = document.createElement("span");
      inner.className = "inline-block";
      inner.textContent = word;

      outer.appendChild(inner);
      heading.appendChild(outer);
      innerSpans.push(inner);

      if (index < words.length - 1) {
        heading.appendChild(document.createTextNode(" "));
      }
    });

    return innerSpans;
  }

  if (typeof window.Lenis !== "undefined") {
    var lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      gestureOrientation: "vertical"
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  var headings = gsap.utils.toArray("h1");

  headings.forEach(function (heading) {
    var parts = splitHeadingWords(heading);
    if (!parts.length) return;

    gsap.set(parts, { autoAlpha: 0, yPercent: 110 });

    gsap.to(parts, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: heading,
        start: "top 86%",
        once: true
      }
    });
  });

  var revealItems = gsap.utils.toArray("[data-reveal]");

  revealItems.forEach(function (item) {
    gsap.fromTo(
      item,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
          once: true
        }
      }
    );
  });

  var isProjectPage = window.location.pathname.indexOf("/projects/") !== -1;
  if (isProjectPage) {
    var mediaItems = gsap.utils.toArray("main img, main video");

    mediaItems.forEach(function (media) {
      gsap.fromTo(
        media,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: media,
            start: "top 88%",
            once: true
          }
        }
      );
    });
  }

  var parallaxItems = gsap.utils.toArray("[data-speed]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    parallaxItems.forEach(function (item) {
      var speed = parseFloat(item.getAttribute("data-speed"));
      if (isNaN(speed)) return;

      var wrap = item.closest("[data-parallax-wrap]") || item;

      gsap.to(item, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  var isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;

  if (isLargeScreen) {
    var headerVideo = document.querySelector(".header-video");
    if (headerVideo) {
      var em = parseFloat(getComputedStyle(document.documentElement).fontSize);
      var offset = 2 * em;

      setTimeout(function () {
        var rect = headerVideo.getBoundingClientRect();
        var startX = window.innerWidth - offset - rect.right;
        var startY = window.innerHeight - offset - rect.bottom;
        var startScale = 0.25;
        var scrollStart = 0;
        var scrollEnd = window.innerHeight;

        function updateTransform(scrollY) {
          var progress = gsap.utils.clamp(0, 1, (scrollY - scrollStart) / (scrollEnd - scrollStart));
          var x = startX * (1 - progress);
          var y = startY * (1 - progress);
          var scale = startScale + (1 - startScale) * progress;

          gsap.set(headerVideo, { x: x, y: y, scale: scale, overwrite: true });
        }

        updateTransform(window.scrollY);

        if (typeof lenis !== "undefined" && lenis) {
          lenis.on("scroll", function (e) {
            updateTransform(e.scroll);
          });
        } else {
          window.addEventListener(
            "scroll",
            function () {
              updateTransform(window.scrollY);
            },
            { passive: true }
          );
        }
      }, 50);
    }
  }

  if (typeof window.Swiper !== "undefined") {
    var reviewsSlider = document.querySelector(".reviews-swiper");
    if (reviewsSlider) {
      new Swiper(reviewsSlider, {
        speed: 700,
        spaceBetween: 18,
        slidesPerView: 1.12,
        watchOverflow: true,
        navigation: {
          nextEl: ".reviews-next",
          prevEl: ".reviews-prev"
        },
        breakpoints: {
          768: {
            slidesPerView: 2.02,
            spaceBetween: 20
          },
          1200: {
            slidesPerView: 3.02,
            spaceBetween: 22
          }
        }
      });
    }
  }

  var footerLogos = gsap.utils.toArray(".footer-logo-svg[data-svg-src]");
  var footerLogoOrder = { s: 0, t: 1, u: 2, d: 3, i: 4, o: 5 };

  footerLogos.forEach(function (container) {
    var src = container.getAttribute("data-svg-src");
    if (!src) return;

    fetch(src)
      .then(function (res) {
        return res.text();
      })
      .then(function (svgText) {
        container.innerHTML = svgText;
        var svg = container.querySelector("svg");
        if (!svg) return;

        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.removeAttribute("id");

        var paths = Array.prototype.slice.call(svg.querySelectorAll("path"));
        if (!paths.length) return;

        paths.sort(function (a, b) {
          var aid = (a.id || "").toLowerCase();
          var bid = (b.id || "").toLowerCase();
          var av = Object.prototype.hasOwnProperty.call(footerLogoOrder, aid) ? footerLogoOrder[aid] : 999;
          var bv = Object.prototype.hasOwnProperty.call(footerLogoOrder, bid) ? footerLogoOrder[bid] : 999;
          return av - bv;
        });

        gsap.set(paths, { autoAlpha: 0, yPercent: 24 });

        gsap.to(paths, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: container,
            start: "top 92%",
            once: true
          }
        });

        ScrollTrigger.refresh();
      })
      .catch(function () {});
  });

  var faqItems = document.querySelectorAll(".faq-item");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  faqItems.forEach(function (item) {
    var summary = item.querySelector("summary");
    var answer = item.querySelector(".faq-answer");
    var inner = item.querySelector(".faq-answer-inner");
    if (!summary || !answer || !inner) return;

    var isAnimating = false;

    if (!item.hasAttribute("open")) {
      answer.style.height = "0px";
      answer.style.opacity = "0";
    } else {
      answer.style.height = "auto";
      answer.style.opacity = "1";
    }

    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (isAnimating) return;

      var isOpen = item.hasAttribute("open");

      if (reduceMotion) {
        if (isOpen) {
          item.removeAttribute("open");
          answer.style.height = "0px";
          answer.style.opacity = "0";
        } else {
          item.setAttribute("open", "");
          answer.style.height = "auto";
          answer.style.opacity = "1";
        }
        return;
      }

      isAnimating = true;

      if (isOpen) {
        answer.style.height = answer.offsetHeight + "px";
        answer.style.opacity = "1";

        requestAnimationFrame(function () {
          answer.style.height = "0px";
          answer.style.opacity = "0";
        });

        var onCloseEnd = function (ev) {
          if (ev.propertyName !== "height") return;
          item.removeAttribute("open");
          answer.style.height = "0px";
          answer.style.opacity = "0";
          isAnimating = false;
          answer.removeEventListener("transitionend", onCloseEnd);
        };

        answer.addEventListener("transitionend", onCloseEnd);
      } else {
        item.setAttribute("open", "");
        answer.style.height = "0px";
        answer.style.opacity = "0";

        requestAnimationFrame(function () {
          answer.style.height = inner.offsetHeight + "px";
          answer.style.opacity = "1";
        });

        var onOpenEnd = function (ev) {
          if (ev.propertyName !== "height") return;
          answer.style.height = "auto";
          answer.style.opacity = "1";
          isAnimating = false;
          answer.removeEventListener("transitionend", onOpenEnd);
        };

        answer.addEventListener("transitionend", onOpenEnd);
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var words = ["brand", "website", "campaign", "socials", "identity"];
    var wordEl = document.getElementById("word");
    if (!wordEl) return;

    var index = 0;
    var visibleDelay = 2000;
    var animDuration = 500;

    wordEl.style.transition = "transform " + animDuration + "ms cubic-bezier(.2,.9,.3,1)";
    wordEl.style.transform = "translateY(0)";

    function nextWord() {
      var stepPx = wordEl.getBoundingClientRect().height;
      wordEl.style.transform = "translateY(-" + stepPx + "px)";

      setTimeout(function () {
        index = (index + 1) % words.length;
        wordEl.textContent = words[index];

        wordEl.style.transition = "none";
        wordEl.style.transform = "translateY(" + stepPx + "px)";
        wordEl.offsetHeight;
        wordEl.style.transition = "transform " + animDuration + "ms cubic-bezier(.2,.9,.3,1)";
        wordEl.style.transform = "translateY(0)";
      }, animDuration);
    }

    setInterval(nextWord, visibleDelay + animDuration);
  });
})();
