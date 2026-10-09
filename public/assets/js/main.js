(function () {
  var rootEl = document.documentElement;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isNavigating = false;

  function markPageReady() {
    if (!rootEl) return;
    rootEl.classList.remove("is-loading");
    rootEl.classList.remove("is-transitioning");
  }

  function queuePageReady() {
    requestAnimationFrame(function () {
      requestAnimationFrame(markPageReady);
    });
  }

  function shouldHandleNavigation(anchor, targetUrl) {
    if (!anchor || !targetUrl) return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.getAttribute("target") && anchor.getAttribute("target") !== "_self") return false;
    if (anchor.getAttribute("rel") === "external") return false;
    if (targetUrl.origin !== window.location.origin) return false;

    var protocol = targetUrl.protocol.toLowerCase();
    if (protocol !== "http:" && protocol !== "https:") return false;

    // Ignore same-page hash jumps.
    var samePath = targetUrl.pathname === window.location.pathname;
    var sameSearch = targetUrl.search === window.location.search;
    if (samePath && sameSearch && targetUrl.hash) return false;

    return true;
  }

  function setupPageTransitions() {
    document.addEventListener(
      "click",
      function (event) {
        if (isNavigating) return;
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        var anchor = event.target && event.target.closest ? event.target.closest("a[href]") : null;
        if (!anchor) return;

        var targetUrl;
        try {
          targetUrl = new URL(anchor.href, window.location.href);
        } catch (_err) {
          return;
        }

        if (!shouldHandleNavigation(anchor, targetUrl)) return;

        event.preventDefault();
        isNavigating = true;
        if (rootEl) rootEl.classList.add("is-transitioning");

        var delay = prefersReducedMotion ? 0 : 170;
        window.setTimeout(function () {
          window.location.assign(targetUrl.href);
        }, delay);
      },
      true
    );

    window.addEventListener("pageshow", function () {
      isNavigating = false;
      markPageReady();
    });
  }

  setupPageTransitions();

  function setupLanguagePreferenceLinks() {
    var langLinks = Array.prototype.slice.call(document.querySelectorAll("a[href]")).filter(function (link) {
      var label = (link.textContent || "").trim().toUpperCase();
      return label === "EN" || label === "NL";
    });

    if (!langLinks.length) return;

    langLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        var label = (link.textContent || "").trim().toUpperCase();
        try {
          window.localStorage.setItem("site-language-preference", label === "NL" ? "nl" : "en");
        } catch (_err) {
          // Ignore storage failures, navigation should still work.
        }
      });
    });
  }

  setupLanguagePreferenceLinks();

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

  if (rootEl) {
    rootEl.classList.toggle("has-gsap", !!(hasGSAP && hasScrollTrigger));
  }

  if (!hasGSAP || !hasScrollTrigger) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", queuePageReady, { once: true });
    } else {
      queuePageReady();
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function splitHeadingWords(heading) {
    if (heading.dataset.splitDone === "1") return [];

    var sourceNodes = Array.prototype.slice.call(heading.childNodes);
    if (!sourceNodes.length) return [];

    var tokens = [];

    sourceNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var parts = (node.nodeValue || "").match(/(\s+|[^\s]+)/g) || [];
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            tokens.push({ type: "space", value: part });
          } else {
            tokens.push({ type: "word", value: part });
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        tokens.push({ type: "element", node: node.cloneNode(true) });
      }
    });

    if (!tokens.length) return [];

    heading.textContent = "";
    heading.dataset.splitDone = "1";

    var innerSpans = [];

    tokens.forEach(function (token) {
      if (token.type === "space") {
        heading.appendChild(document.createTextNode(token.value));
        return;
      }

      if (token.type === "element") {
        var elementOuter = document.createElement("span");
        elementOuter.className = "heading-word-mask";

        var elementInner = document.createElement("span");
        elementInner.className = "word";
        elementInner.appendChild(token.node);

        elementOuter.appendChild(elementInner);
        heading.appendChild(elementOuter);
        innerSpans.push(elementInner);
        return;
      }

      var outer = document.createElement("span");
      outer.className = "heading-word-mask";

      var inner = document.createElement("span");
      inner.className = "word";
      inner.textContent = token.value;

      outer.appendChild(inner);
      heading.appendChild(outer);
      innerSpans.push(inner);
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

    if (prefersReducedMotion) {
      gsap.set(parts, { autoAlpha: 1, yPercent: 0 });
      heading.dataset.revealDone = "1";
      return;
    }

    gsap.fromTo(
      parts,
      { autoAlpha: 0, yPercent: 120 },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.06,
        overwrite: true,
        delay: 0.05,
        onComplete: function () {
          heading.dataset.revealDone = "1";
        }
      }
    );
  });

  var revealItems = gsap
    .utils
    .toArray("[data-reveal]")
    .filter(function (item) {
      return !item.querySelector("h1.fade-in-stagger");
    });

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

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(queuePageReady);
  } else {
    queuePageReady();
  }

  var isProjectPage = window.location.pathname.indexOf("/projects/") !== -1;
  if (isProjectPage) {
    var mediaItems = gsap.utils.toArray("main img:not(.project-featured-image), main video");

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
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
        navigation: {
          nextEl: ".reviews-next",
          prevEl: ".reviews-prev"
        },
        breakpoints: {
          768: {
            slidesPerView: 2.02,
            spaceBetween: 20,
            slidesOffsetBefore: 48,
            slidesOffsetAfter: 48
          },
          1200: {
            slidesPerView: 3.02,
            spaceBetween: 22,
            slidesOffsetBefore: 48,
            slidesOffsetAfter: 48
          }
        }
      });
    }

    var musicSlider = document.querySelector(".music-swiper");
    if (musicSlider) {
      new Swiper(musicSlider, {
        effect: "coverflow",
        centeredSlides: true,
        grabCursor: true,
        loop: false,
        speed: 700,
        slidesPerView: 1.1,
        spaceBetween: 20,
        coverflowEffect: {
          rotate: 24,
          stretch: 0,
          depth: 260,
          modifier: 1.05,
          slideShadows: false
        },
        navigation: {
          nextEl: ".music-next",
          prevEl: ".music-prev"
        },
        breakpoints: {
          768: {
            slidesPerView: 1.8,
            spaceBetween: 28,
            coverflowEffect: {
              rotate: 28,
              stretch: 0,
              depth: 300,
              modifier: 1.1,
              slideShadows: false
            }
          },
          1200: {
            slidesPerView: 2.6,
            spaceBetween: 30,
            coverflowEffect: {
              rotate: 32,
              stretch: 0,
              depth: 360,
              modifier: 1.2,
              slideShadows: false
            }
          }
        }
      });
    }
  }

  var menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    var syncMenuBlend = function () {
      document.body.classList.toggle("menu-open", !!menuToggle.checked);
    };

    syncMenuBlend();
    menuToggle.addEventListener("change", syncMenuBlend);

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        document.body.classList.remove("menu-open");
      }
    });
  }

  var zodiacRoots = document.querySelectorAll("[data-zodiac-filter-root]");

  zodiacRoots.forEach(function (root) {
    var filterWrap = root.querySelector("[data-zodiac-filters]");
    var grid = root.querySelector("[data-zodiac-grid]");
    var resetButton = root.querySelector("[data-filter-reset]");
    if (!filterWrap || !grid) return;

    var buttons = Array.prototype.slice.call(filterWrap.querySelectorAll("button[data-filter]"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll("article[data-element]"));
    if (!buttons.length || !cards.length) return;

    var activeFilter = "";
    var isFiltering = false;

    function applyFilter(nextFilter) {
      if (isFiltering) return;
      activeFilter = nextFilter || "";
      isFiltering = true;

      buttons.forEach(function (button) {
        var isActive = button.getAttribute("data-filter") === activeFilter;
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      var visibleCards = cards.filter(function (card) {
        var cardElement = card.getAttribute("data-element");
        return !activeFilter || cardElement === activeFilter;
      });

      if (typeof gsap === "undefined") {
        cards.forEach(function (card) {
          card.hidden = visibleCards.indexOf(card) === -1;
        });
        isFiltering = false;
        return;
      }

      gsap.to(cards, {
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.2,
        ease: "power2.inOut",
        stagger: 0.01,
        onComplete: function () {
          cards.forEach(function (card) {
            card.hidden = visibleCards.indexOf(card) === -1;
            if (!card.hidden) {
              gsap.set(card, { autoAlpha: 0, scale: 0.985 });
            }
          });

          gsap.to(visibleCards, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.04,
            onComplete: function () {
              isFiltering = false;
            }
          });
        }
      });
    }

    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", function () {
        var nextFilter = button.getAttribute("data-filter") || "";
        applyFilter(nextFilter);
      });
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        applyFilter("");
      });
    }

    applyFilter("");
  });

  var footerLogos = gsap.utils.toArray(".footer-logo-svg");

  footerLogos.forEach(function (container) {
    var svg = container.querySelector("svg");
    if (!svg) return;

    var paths = Array.prototype.slice.call(svg.querySelectorAll("path"));
    if (!paths.length) return;

    // Curved baseline at first (outer letters lower), then flatten on scroll.
    var curveOffsets = [72, 40, 18, 0, 18, 40, 72];
    var curveRotations = [-7, -3.5, -1, 0, 1, 3.5, 7];

    gsap.set(paths, {
      autoAlpha: 1,
      y: prefersReducedMotion ? 0 : function (i) {
        return i < curveOffsets.length ? curveOffsets[i] : 0;
      },
      rotation: prefersReducedMotion ? 0 : function (i) {
        return i < curveRotations.length ? curveRotations[i] : 0;
      },
      transformOrigin: "50% 100%"
    });

    function createFooterFlattenScrub() {
      if (prefersReducedMotion) return;

      gsap.to(paths, {
        y: 0,
        rotation: 0,
        ease: "none",
        overwrite: "auto",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "max",
          scrub: 1
        }
      });

      ScrollTrigger.refresh();
    }

    createFooterFlattenScrub();
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
