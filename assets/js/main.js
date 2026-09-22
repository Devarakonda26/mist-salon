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
      whatsapp: "+919257199299"
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
     9. FORM VALIDATION + WHATSAPP HANDOFF
     On submit, the form's fields are collected into a readable message
     and sent to MiST's WhatsApp number via a wa.me link (opens WhatsApp
     Web or the app with the message pre-filled, ready to send). The
     on-page success message then confirms this to the user.
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

        // Build a readable message from every labelled field in the form.
        var lines = [];
        form.querySelectorAll("input, select, textarea").forEach(function (field) {
          if (!field.id || !field.value) return;
          var label = form.querySelector('label[for="' + field.id + '"]');
          var labelText = label ? label.textContent.trim() : field.id;
          lines.push(labelText + ": " + field.value);
        });
        var heading = form.closest("section") && form.querySelector('button[type="submit"]').textContent.trim() === "Book Appointment"
          ? "New appointment request from the MiST website:"
          : "New enquiry from the MiST website:";
        var messageText = heading + "\n\n" + lines.join("\n");
        var whatsappNumber = (window.mistConfig.social.whatsapp || "").replace(/\D/g, "");
        if (whatsappNumber) {
          var waUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(messageText);
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }

        var success = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
        form.style.display = "none";
        if (success) {
          success.classList.add("show");
          success.setAttribute("role", "status");
          success.focus();
        }
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
     9b. BOOKING FORM: GENDER -> CATEGORY -> SERVICE CASCADE
     The booking form asks for Gender first, then narrows the Service
     Category options to what that gender books at MiST, then narrows
     Service to what belongs in the chosen category. Edit
     window.mistConfig.bookingServices below to change which services
     appear for which gender/category, the whole form reads from it.
  ------------------------------------------------------------------ */
  window.mistConfig.bookingServices = {
    Male: {
      "Hair": ["Haircut", "Kids Haircut", "Hair Styling", "Hair Wash & Blow-Dry", "Hair Colour", "Global Hair Colour", "Hair Straightening", "Hair Smoothening", "Dandruff Treatment", "Hair Patches", "Keratin & Neoplex", "Davines Hair Spa"],
      "Skin": ["Classic Facial", "De-Tan Cleanup", "HydraFacial", "Skin Polishing", "Chemical Peels", "Acne Care Facial", "Pigmentation Care", "Anti-Aging Facial", "Skin Rejuvenation", "Kansa Thali", "Aroma Therapy"],
      "Makeup": ["Groom Makeup"],
      "Cosmetic Treatments": ["PRP / GFC", "Body Contouring", "Scalp Micropigmentation", "Ear Piercing"]
    },
    Female: {
      "Hair": ["Haircut", "Kids Haircut", "Hair Styling", "Hair Wash & Blow-Dry", "Hair Colour", "Global Hair Colour", "Highlights", "Balayage & Ombré", "Hair Straightening", "Hair Smoothening", "Dandruff Treatment", "Hair Extensions", "Nano Hair Extensions", "Keratin & Neoplex", "Davines Hair Spa"],
      "Skin & Facials": ["Classic Facial", "De-Tan Cleanup", "HydraFacial", "Skin Polishing", "Chemical Peels", "Acne Care Facial", "Pigmentation Care", "Anti-Aging Facial", "Skin Rejuvenation"],
      "Makeup": ["Party Makeup", "Basic Makeup"],
      "Wedding": ["Bridal Makeup", "Engagement Makeup", "Reception Makeup", "Makeup Trial", "Mehendi", "Bridal Hair Styling"],
      "Nails": ["Manicure", "Pedicure", "Gel Polish", "Nail Extensions", "Nail Art", "Crystal Glam / Ice Cream", "Paraffin Spa"],
      "Lashes & Brows": ["Eyelash Extensions", "Eyelash Tinting", "Eyebrow Shaping", "Painless Threading"],
      "Permanent Makeup": ["Microblading", "Ombré Brows", "Permanent Eyeliner", "Lip Blush"],
      "Hair & Scalp Solutions": ["Scalp Micropigmentation"],
      "Clinical Treatments": ["Body Contouring", "PRP / GFC"],
      "Special Services": ["Aroma Therapy", "Kansa Thali", "Ear Piercing"]
    }
  };

  function initBookingCascade() {
    var genderSelect = document.getElementById("b-gender");
    var categorySelect = document.getElementById("b-category");
    var serviceSelect = document.getElementById("b-service");
    if (!genderSelect || !categorySelect || !serviceSelect) return;

    var servicesByGender = window.mistConfig.bookingServices;

    function resetSelect(select, placeholderText, disabled) {
      select.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.selected = true;
      placeholder.disabled = true;
      placeholder.textContent = placeholderText;
      select.appendChild(placeholder);
      select.disabled = disabled;
    }

    function populateCategories() {
      var gender = genderSelect.value;
      var categories = gender ? Object.keys(servicesByGender[gender] || {}) : [];
      resetSelect(categorySelect, gender ? "Select a category" : "Select gender first", !gender);
      categories.forEach(function (cat) {
        var opt = document.createElement("option");
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });
      resetSelect(serviceSelect, "Select a category first", true);
    }

    function populateServices() {
      var gender = genderSelect.value;
      var category = categorySelect.value;
      var services = (gender && category && servicesByGender[gender]) ? (servicesByGender[gender][category] || []) : [];
      resetSelect(serviceSelect, category ? "Select a service" : "Select a category first", !category);
      services.forEach(function (name) {
        var opt = document.createElement("option");
        opt.textContent = name;
        serviceSelect.appendChild(opt);
      });
      if (category) {
        var other = document.createElement("option");
        other.textContent = "Other / Not Sure";
        serviceSelect.appendChild(other);
      }
    }

    genderSelect.addEventListener("change", function () {
      populateCategories();
    });
    categorySelect.addEventListener("change", function () {
      populateServices();
    });
  }

  /* ------------------------------------------------------------------
     9c. HOMEPAGE BOOK APPOINTMENT POPUP
     Shown once per browser session on the homepage, a short delay
     after load. Gender -> Service reuses the same
     window.mistConfig.bookingServices data as the booking page (just
     the category names, not the full per-category service list), and
     submission goes through the same .mist-form / initForms() flow,
     so it opens WhatsApp exactly like the main booking form does.
  ------------------------------------------------------------------ */
  function initBookingPopup() {
    var popup = document.getElementById("mist-booking-popup");
    if (!popup) return;

    var closeBtn = popup.querySelector(".popup-close");
    var genderSelect = document.getElementById("pb-gender");
    var serviceSelect = document.getElementById("pb-service");
    var SESSION_KEY = "mistBookingPopupShown";

    function populateServiceCategories() {
      var gender = genderSelect.value;
      var servicesByGender = (window.mistConfig && window.mistConfig.bookingServices) || {};
      var categories = gender && servicesByGender[gender] ? Object.keys(servicesByGender[gender]) : [];

      serviceSelect.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.selected = true;
      placeholder.disabled = true;
      placeholder.textContent = gender ? "Select a service" : "Select gender first";
      serviceSelect.appendChild(placeholder);
      categories.forEach(function (cat) {
        var opt = document.createElement("option");
        opt.textContent = cat;
        serviceSelect.appendChild(opt);
      });
      serviceSelect.disabled = !gender;
    }

    if (genderSelect && serviceSelect) {
      genderSelect.addEventListener("change", populateServiceCategories);
    }

    function openPopup() {
      popup.classList.add("open");
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("popup-open");
      var firstField = document.getElementById("pb-name");
      if (firstField) firstField.focus();
    }

    function closePopup() {
      popup.classList.remove("open");
      popup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("popup-open");
    }

    if (closeBtn) closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", function (e) {
      if (e.target === popup) closePopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && popup.classList.contains("open")) closePopup();
    });

    var alreadyShown = false;
    try {
      alreadyShown = !!sessionStorage.getItem(SESSION_KEY);
    } catch (e) {
      alreadyShown = false; // sessionStorage unavailable (private browsing, etc.) - show once anyway
    }

    if (!alreadyShown) {
      setTimeout(function () {
        openPopup();
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* ignore */ }
      }, 1000);
    }
  }

  /* ------------------------------------------------------------------
     9d. INSTAGRAM EMBED RETRY
     Instagram's own embed.js converts each <blockquote class="instagram-media">
     into a playable iframe by fetching that post from Instagram’s
     servers. It only tries once, when the script itself finishes
     loading, so if any single reel's fetch is slow or briefly
     rate-limited, that one is left showing the bare "View this reel
     on Instagram" fallback link forever. Re-running Embeds.process()
     a few more times catches any stragglers still left in the DOM
     (a processed blockquote is replaced by an iframe, so once none
     remain there is nothing left to retry).
  ------------------------------------------------------------------ */
  function initInstagramEmbedRetry() {
    if (!document.querySelector("blockquote.instagram-media")) return;

    function retry() {
      if (!document.querySelector("blockquote.instagram-media")) return;
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    }

    [1500, 3500, 6000, 10000].forEach(function (delay) {
      setTimeout(retry, delay);
    });
  }

  /* ------------------------------------------------------------------
     9e. FLOATING CALL + WHATSAPP BUTTONS
     Two fixed icon buttons, stacked bottom-right, on every page.
     Hovering either shows a "Book Now via ..." tooltip without any
     click. The WhatsApp one is a direct link (only one number to go
     to). The Call one, since there are two MiST numbers, opens a
     small panel on click so the visitor can choose which to dial.
     Injected here (not hand-added to every HTML file) so both show
     up site-wide automatically. Skipped on Contact and Book
     Appointment, since both already lead with call/contact info.
  ------------------------------------------------------------------ */
  function initFloatingCTAs() {
    var basename = window.location.pathname.split("/").pop().toLowerCase();
    if (basename === "contact.html" || basename === "book-appointment.html") return;

    var business = window.mistConfig.business;
    var whatsappNumber = (socialLinks.whatsapp || "").replace(/\D/g, "");
    if ((!business || !business.phone1Tel) && !whatsappNumber) return;

    var container = document.createElement("div");
    container.className = "mist-floating-cta";
    container.id = "mist-floating-cta";

    // --- Call button (opens a panel to choose between the two numbers) ---
    if (business && business.phone1Tel) {
      var callWrap = document.createElement("div");
      callWrap.className = "call-fab-wrap";
      callWrap.id = "mist-call-fab";

      var panel = document.createElement("div");
      panel.className = "call-fab-panel";
      panel.setAttribute("role", "menu");

      var label = document.createElement("span");
      label.className = "call-fab-label";
      label.textContent = "Choose a number to call";
      panel.appendChild(label);

      [
        [business.phone1, business.phone1Tel],
        [business.phone2, business.phone2Tel]
      ].forEach(function (pair) {
        var display = pair[0], telValue = pair[1];
        if (!telValue) return;
        var link = document.createElement("a");
        link.className = "call-fab-link";
        link.href = "tel:" + telValue;
        link.innerHTML = '<i class="bi bi-telephone-fill"></i>' + display;
        panel.appendChild(link);
      });

      var callBtn = document.createElement("button");
      callBtn.type = "button";
      callBtn.className = "fab-btn call-fab-btn";
      callBtn.setAttribute("aria-label", "Book now via call");
      callBtn.setAttribute("aria-expanded", "false");
      callBtn.innerHTML = '<i class="bi bi-telephone-fill"></i><span class="fab-tooltip">Book Now via Call</span>';

      callWrap.appendChild(panel);
      callWrap.appendChild(callBtn);
      container.appendChild(callWrap);

      callBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = callWrap.classList.toggle("open");
        callBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      document.addEventListener("click", function (e) {
        if (!callWrap.contains(e.target)) {
          callWrap.classList.remove("open");
          callBtn.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          callWrap.classList.remove("open");
          callBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    // --- WhatsApp button (single number, so it's a direct link) ---
    if (whatsappNumber) {
      var waMsg = encodeURIComponent("Hi MiST! I'd like to book an appointment.");
      var waLink = document.createElement("a");
      waLink.className = "fab-btn whatsapp-fab-btn";
      waLink.href = "https://wa.me/" + whatsappNumber + "?text=" + waMsg;
      waLink.target = "_blank";
      waLink.rel = "noopener noreferrer";
      waLink.setAttribute("aria-label", "Book now via WhatsApp");
      waLink.innerHTML = '<i class="bi bi-whatsapp"></i><span class="fab-tooltip">Book Now via WhatsApp</span>';
      container.appendChild(waLink);
    }

    document.body.appendChild(container);
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
    initBookingCascade();
    initBookingPopup();
    initInstagramEmbedRetry();
    initFloatingCTAs();
    initImageFallbacks();
    markActiveNav();
  });
})();
