/* ==========================================================================
   MiST Unisex Salon — main.js
   Vanilla JS only. No frameworks, no jQuery.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. CENTRAL CONFIGURATION
     Update business info / social links here — the whole site reads
     from this single object.
  ------------------------------------------------------------------ */
  window.mistConfig = {
    business: {
      name: "MiST Unisex Salon",
      tagline: "Salon · PMU · Laser",
      city: "Kurnool, Andhra Pradesh",
      address: "#46/694, 1st Floor, Above Apollo Pharmacy, G.G.H. Road, Budhwarpet, Kurnool - 518002",
      email: "mistunisexsalon@gmail.com",
      phone1: "+91 92571 99299",
      phone1Tel: "+919257199299",
      phone2: "+91 96668 71724",
      phone2Tel: "+919666871724",
      hours: "Open Daily · 9:00 AM – 9:00 PM"
    },
    social: {
      instagram: "https://www.instagram.com/mistsalonkurnool/",
      facebook: "https://www.facebook.com/mistsalon",
      twitter: "https://twitter.com/mistsalon",
      youtube: "",
      whatsapp: ""
    }
  };

  var socialLinks = window.mistConfig.social;

  /* ------------------------------------------------------------------
     2. SOCIAL ICON / WHATSAPP VISIBILITY LOGIC
     Any element with data-social="instagram|facebook|youtube|whatsapp"
     is shown only if the corresponding URL/number is configured.
  ------------------------------------------------------------------ */
  function applySocialLinks() {
    document.querySelectorAll("[data-social]").forEach(function (el) {
      var key = el.getAttribute("data-social");
      var value = socialLinks[key];
      if (!value) {
        el.style.display = "none";
        return;
      }
      if (key === "whatsapp") {
        var msg = encodeURIComponent("Hi MiST! I'd like to book an appointment.");
        el.setAttribute("href", "https://wa.me/" + value.replace(/\D/g, "") + "?text=" + msg);
      } else {
        el.setAttribute("href", value);
      }
      el.removeAttribute("hidden");
    });

    // Mobile sticky CTA: hide WhatsApp button if not configured, expand Book button
    var mscWhatsapp = document.querySelector(".msc-whatsapp");
    var mscBook = document.querySelector(".msc-book");
    if (mscWhatsapp && !socialLinks.whatsapp) {
      mscWhatsapp.style.display = "none";
      if (mscBook) mscBook.style.flex = "1 1 100%";
    }
  }

  /* ------------------------------------------------------------------
     3. NAVBAR SCROLL BEHAVIOUR
  ------------------------------------------------------------------ */
  function initNavbarScroll() {
    var nav = document.querySelector(".mist-navbar");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 60) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     4. MOBILE OFFCANVAS MENU
  ------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.querySelector(".navbar-toggler-mist");
    var menu = document.querySelector(".mist-mobile-menu");
    var closeBtn = document.querySelector(".mm-close");
    if (!toggle || !menu) return;

    function open() {
      menu.classList.add("open");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL
  ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. GALLERY FILTER
  ------------------------------------------------------------------ */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll("[data-gallery-item]");
    if (!buttons.length || !items.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var cat = item.getAttribute("data-category");
          if (filter === "All" || cat === filter) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     7. LIGHTBOX
  ------------------------------------------------------------------ */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-src]"));
    if (!triggers.length) return;
    var lb = document.querySelector(".mist-lightbox");
    if (!lb) return;
    var img = lb.querySelector("img");
    var closeBtn = lb.querySelector(".lb-close");
    var prevBtn = lb.querySelector(".lb-prev");
    var nextBtn = lb.querySelector(".lb-next");
    var current = 0;

    function show(index) {
      var visible = triggers.filter(function (t) { return t.offsetParent !== null; });
      var list = visible.length ? visible : triggers;
      current = ((index % list.length) + list.length) % list.length;
      img.src = list[current].getAttribute("data-lightbox-src");
      img.alt = list[current].getAttribute("data-lightbox-alt") || "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      img.src = "";
    }
    triggers.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ------------------------------------------------------------------
     8. BEFORE / AFTER SLIDER
  ------------------------------------------------------------------ */
  function initBeforeAfter() {
    document.querySelectorAll(".ba-slider").forEach(function (slider) {
      var afterImg = slider.querySelector(".ba-after");
      var handle = slider.querySelector(".ba-handle");
      if (!afterImg || !handle) return;
      var dragging = false;

      function setPosition(pct) {
        pct = Math.max(0, Math.min(100, pct));
        afterImg.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
      }
      function handleMove(clientX) {
        var rect = slider.getBoundingClientRect();
        var pct = ((clientX - rect.left) / rect.width) * 100;
        setPosition(pct);
      }
      handle.addEventListener("mousedown", function () { dragging = true; });
      window.addEventListener("mouseup", function () { dragging = false; });
      window.addEventListener("mousemove", function (e) {
        if (dragging) handleMove(e.clientX);
      });
      slider.addEventListener("click", function (e) {
        if (e.target.closest(".ba-handle")) return;
        handleMove(e.clientX);
      });
      handle.addEventListener("touchstart", function () { dragging = true; }, { passive: true });
      window.addEventListener("touchend", function () { dragging = false; });
      window.addEventListener("touchmove", function (e) {
        if (dragging && e.touches[0]) handleMove(e.touches[0].clientX);
      }, { passive: true });
      handle.setAttribute("tabindex", "0");
      handle.setAttribute("role", "slider");
      handle.setAttribute("aria-label", "Before and after comparison slider");
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.addEventListener("keydown", function (e) {
        var current = parseFloat(handle.style.left) || 50;
        if (e.key === "ArrowLeft") setPosition(current - 5);
        if (e.key === "ArrowRight") setPosition(current + 5);
      });
    });

    // Before/After category tabs
    var tabs = document.querySelectorAll(".ba-tab");
    var panels = document.querySelectorAll("[data-ba-panel]");
    if (tabs.length && panels.length) {
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) { t.classList.remove("active"); });
          tab.classList.add("active");
          var target = tab.getAttribute("data-ba-target");
          panels.forEach(function (p) {
            p.style.display = p.getAttribute("data-ba-panel") === target ? "" : "none";
          });
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     9. FORM VALIDATION + SUCCESS MESSAGE (frontend only)
  ------------------------------------------------------------------ */
  function initForms() {
    document.querySelectorAll(".mist-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          var firstInvalid = form.querySelector(":invalid");
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        form.classList.add("was-validated");
        var success = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
        form.style.display = "none";
        if (success) {
          success.classList.add("show");
          success.setAttribute("role", "status");
          success.focus();
        }
        // NOTE: This is a frontend-only success state. To go live, connect
        // this submit handler to WhatsApp (wa.me link with prefilled text),
        // a form backend (e.g. Formspree), or an email/booking service.
      });
    });
  }

  /* ------------------------------------------------------------------
     10b. IMAGE FALLBACK SAFETY NET
     Every photo on the site is temporary stock photography (see
     data/site_data.py) pending real MiST photography. If any hot-linked
     image fails to load for any reason, swap it for an on-brand SVG
     placeholder (burgundy/blush gradient + MiST monogram) rather than
     showing a broken image icon — or worse, an unrelated random photo.
  ------------------------------------------------------------------ */
  function placeholderDataUri() {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#4A0E1B"/><stop offset="100%" stop-color="#C47F8A"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="1000" fill="url(#g)"/>' +
      '<text x="400" y="470" font-family="Georgia, serif" font-size="120" fill="#FFF9F7" ' +
      'text-anchor="middle" font-style="italic">M</text>' +
      '<text x="400" y="560" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" ' +
      'fill="#FFF9F7" fill-opacity="0.85" text-anchor="middle">MiST UNISEX SALON</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }
  var PLACEHOLDER_URI = placeholderDataUri();

  function initImageFallbacks() {
    // <img> tags
    document.querySelectorAll("img").forEach(function (img) {
      if (img.src === PLACEHOLDER_URI) return;
      img.addEventListener("error", function onErr() {
        img.removeEventListener("error", onErr);
        img.src = PLACEHOLDER_URI;
        img.classList.add("img-fallback");
      }, { once: true });
    });

    // Inline CSS background-image (hero sections, split image panels)
    var bgSelectors = ".hero-bg, .page-hero, [style*='background-image']";
    document.querySelectorAll(bgSelectors).forEach(function (el) {
      var style = el.getAttribute("style") || "";
      var match = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
      if (!match) return;
      var url = match[2];
      if (!url || url.indexOf("data:image/svg+xml") !== -1) return;
      var tester = new Image();
      tester.onerror = function () {
        el.setAttribute("style", style.replace(url, PLACEHOLDER_URI));
      };
      tester.src = url;
    });
  }

  /* ------------------------------------------------------------------
     10. ACTIVE NAV LINK
  ------------------------------------------------------------------ */
  function markActiveNav() {
    var path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    document.querySelectorAll(".nav-links a, .mm-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var clean = href.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
      if (clean === path) a.classList.add("active");
    });
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    applySocialLinks();
    initNavbarScroll();
    initMobileMenu();
    initReveal();
    initGalleryFilter();
    initLightbox();
    initBeforeAfter();
    initForms();
    initImageFallbacks();
    markActiveNav();
  });
})();
