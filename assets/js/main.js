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

  var footerLogos = gsap.utils.toArray(".footer-logo-svg[data-svg-src]");
  var footerLogoOrder = { s: 0, t: 1, u: 2, d: 3, i: 4, o: 5 };
  var studioSvgInline = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 397"><path id="o" d="M1367.92,396.327c-28.29,0-53.45-5.84-75.49-17.52-21.71-11.996-38.65-28.569-50.82-49.719-12.17-21.465-18.26-45.772-18.26-72.92s6.09-51.297,18.26-72.447c12.17-21.465,29.27-38.196,51.31-50.192,22.04-11.995,47.04-17.993,75-17.993s52.8,5.998,74.51,17.993c22.04,11.996,39.14,28.727,51.31,50.192,12.17,21.15,18.26,45.299,18.26,72.447s-6.09,51.455-18.26,72.92c-12.17,21.15-29.27,37.723-51.31,49.719-21.71,11.68-46.55,17.52-74.51,17.52ZM1367.92,320.565c11.52,0,21.71-2.683,30.59-8.049,8.89-5.682,15.79-13.416,20.73-23.202,4.93-9.786,7.4-20.835,7.4-33.146,0-12.627-2.47-23.833-7.4-33.619-4.94-9.786-11.84-17.362-20.73-22.728-8.88-5.682-19.07-8.524-30.59-8.524s-21.87,2.842-31.08,8.524c-8.88,5.366-15.79,12.942-20.73,22.728-4.93,9.786-7.4,20.992-7.4,33.619,0,12.311,2.47,23.36,7.4,33.146,4.94,9.786,11.85,17.52,20.73,23.202,9.21,5.366,19.57,8.049,31.08,8.049Z"/><path id="i" d="M1106.38,123.112h82.4v265.165h-82.4V123.112ZM1148.32,92.808c-13.81,0-25.49-4.577-35.03-13.732-9.21-9.154-13.82-20.361-13.82-33.619,0-8.208,2.14-15.784,6.42-22.728,4.28-6.945,10.03-12.469,17.27-16.573C1130.72,2.052,1139.11,0,1148.32,0,1161.81,0,1173.16,4.577,1182.37,13.732c9.21,8.839,13.81,19.414,13.81,31.725,0,8.839-2.13,16.889-6.41,24.149-4.28,6.945-10.03,12.627-17.27,17.046-7.24,4.104-15.3,6.156-24.18,6.156Z"/><path id="d" d="M896.685,396.327c-25.328,0-47.368-5.998-66.117-17.993-18.75-12.311-33.224-29.042-43.421-50.192-9.868-21.466-14.802-45.773-14.802-72.92,0-28.727,5.427-53.507,16.282-74.341,11.184-21.15,26.151-37.25,44.901-48.298,18.75-11.364,39.473-17.046,62.17-17.046,18.092,0,33.388,3.472,45.888,10.417,12.5,6.629,22.697,15.152,30.592,25.569h.987V9.471h82.395v295.942c0,20.203.66,36.145,1.98,47.825,1.64,11.364,3.95,23.044,6.91,35.039h-81.417c0-.315-.165-.631-.494-.947v-.947c-1.315-5.366-2.467-10.259-3.454-14.678-.657-4.42-.822-7.734-.493-9.944h-.987c-9.21,11.995-20.888,20.834-35.032,26.516-14.145,5.367-29.441,8.05-45.888,8.05ZM916.422,320.092c11.513,0,21.71-2.841,30.592-8.523,8.881-5.682,15.789-13.416,20.723-23.202s7.401-20.834,7.401-33.145c0-12.627-2.467-23.676-7.401-33.146-4.934-9.786-12.006-17.362-21.217-22.728-8.881-5.683-19.079-8.524-30.592-8.524s-21.71,2.841-30.591,8.524c-8.882,5.366-15.79,12.942-20.724,22.728-4.934,9.47-7.401,20.519-7.401,33.146,0,12.311,2.467,23.359,7.401,33.145,4.934,9.786,11.842,17.52,20.724,23.202,8.881,5.682,19.243,8.523,31.085,8.523Z"/><path id="u" d="M581.979,396.327c-21.711,0-39.967-4.104-54.769-12.312-14.803-8.523-25.987-20.676-33.553-36.46-7.565-16.099-11.348-35.513-11.348-58.241V123.112h82.4v139.685c0,17.362,3.125,31.41,9.375,42.143,6.579,10.417,17.27,15.625,32.072,15.625,9.539,0,17.927-2.367,25.164-7.102,7.237-4.735,12.829-11.365,16.776-19.888,3.947-8.838,5.921-19.098,5.921-30.778V123.112h82.4v182.301c0,20.203.658,36.145,1.974,47.824,1.645,11.365,3.947,23.044,6.908,35.04h-81.907c0-.631-.164-1.263-.493-1.894-1.316-5.366-2.467-10.259-3.454-14.679-.658-4.419-.823-7.734-.494-9.943h-.987c-7.565,10.732-17.434,19.256-29.604,25.569-11.842,5.998-27.303,8.997-46.381,8.997Z"/><path id="t" d="M398.001,396.327c-30.921,0-53.947-5.524-69.078-16.573-14.803-11.049-24.013-23.044-27.632-35.987-3.618-12.942-5.427-26.832-5.427-41.668v-107.013h-54.276v-71.974h54.276V49.245h82.4v73.867h71.052v71.974h-71.052v78.602c0,10.417.658,19.098,1.974,26.043,1.315,6.629,4.605,12.469,9.868,17.52,5.592,4.735,13.98,7.103,25.164,7.103,9.868,0,20.724-2.21,32.565-6.63l1.481-.473v70.079c-6.579,3.157-14.309,5.367-23.191,6.629-8.552,1.579-17.927,2.368-28.124,2.368Z"/><path id="s" d="M122.86,396.327c-32.565,0-59.703-6.63-81.413-19.888-21.381-13.574-35.197-31.883-41.447-54.927l76.479-23.675c5.263,12.627,11.842,21.466,19.737,26.516,8.223,5.051,16.776,7.576,25.657,7.576,4.935,0,9.375-.473,13.323-1.42,3.947-1.263,7.072-3.157,9.375-5.682,2.631-2.841,3.947-6.156,3.947-9.944,0-4.419-1.645-8.207-4.934-11.364-2.961-3.157-6.579-5.524-10.855-7.103-4.277-1.894-9.704-3.788-16.283-5.682l-30.592-8.996c-.658-.316-1.316-.474-1.974-.474-13.487-4.104-25.493-9.47-36.019-16.099-10.197-6.629-18.585-15.152-25.164-25.57-6.579-10.417-9.868-22.886-9.868-37.407,0-17.046,4.441-32.041,13.322-44.983,9.21-13.258,22.039-23.518,38.486-30.778,16.447-7.261,35.361-10.891,56.743-10.891,28.289,0,51.973,6.314,71.052,18.94,19.078,12.312,31.578,28.569,37.499,48.772l-75.492,23.675c-3.29-8.523-7.566-15.31-12.829-20.361-5.263-5.05-12.5-7.576-21.71-7.576-4.934,0-9.211.789-12.829,2.368-3.618,1.578-6.579,3.788-8.882,6.629-1.974,2.525-2.961,5.524-2.961,8.997,0,6.313,3.618,11.364,10.855,15.152,7.237,3.472,17.599,6.945,31.085,10.417.329,0,.494.158.494.474h.493l19.243,5.208c.658,0,1.152.158,1.481.474,13.486,3.788,25.493,8.207,36.019,13.258,10.526,4.735,20.065,12.627,28.618,23.675,8.552,10.733,12.829,24.938,12.829,42.616,0,17.993-4.606,33.619-13.816,46.877-9.21,13.259-22.368,23.518-39.473,30.778-17.105,6.945-37.171,10.418-60.197,10.418Z"/></svg>';

  footerLogos.forEach(function (container) {
    container.innerHTML = studioSvgInline;
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

    gsap.set(paths, { autoAlpha: 0, y: 48 });

    ScrollTrigger.create({
      trigger: container,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(paths, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.18
        });
      }
    });

    ScrollTrigger.refresh();
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
