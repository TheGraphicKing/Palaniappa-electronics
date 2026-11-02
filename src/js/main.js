/* Palaniappa Electronics — site interactions (no build step, plain ES2019) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) doc.classList.add("reduced");
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFG = window.PE || {};
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || location.href;
  var abs = function (u) { try { return new URL(u, location.href).href; } catch (e) { return u; } };

  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -130 }); else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (t) { e.preventDefault(); scrollToEl(t); history.replaceState(null, "", id); }
    });
  });
  if (location.hash) {
    var initial = document.getElementById(location.hash.slice(1));
    if (initial) setTimeout(function () { scrollToEl(initial); }, 300);
  }

  /* ---------------- header ---------------- */
  var header = $(".site-header");
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || 0;
    header.classList.toggle("scrolled", y > 30);
    header.classList.toggle("hide", y > 500 && y > lastY && !doc.classList.contains("menu-open"));
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $(".burger");
  if (burger) burger.addEventListener("click", function () {
    var open = doc.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { doc.classList.remove("menu-open"); if (lenis) lenis.start(); }); });
  $$(".has-mega>button").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = b.parentNode, o = p.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
  });
  document.addEventListener("click", function (e) {
    $$(".has-mega.open").forEach(function (m) { if (!m.contains(e.target)) { m.classList.remove("open"); $("button", m).setAttribute("aria-expanded", "false"); } });
  });

  /* ---------------- animations ---------------- */
  if (hasGsap && !reduced) {
    // Hero title
    var lines = $$(".hero h1 .line>span, .page-hero h1 .line>span");
    if (lines.length) gsap.from(lines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.15 });
    gsap.from(".hero .fade-in, .page-hero .fade-in", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.45 });

    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.07, overwrite: true }); }
    });

    // counters
    $$("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count"));
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () {
          gsap.to(obj, { v: end, duration: 2, ease: "power2.out", onUpdate: function () { el.firstChild.nodeValue = Math.round(obj.v).toLocaleString("en-IN"); } });
        }
      });
    });

    // process line
    var proc = $(".process");
    if (proc) gsap.fromTo(proc, { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { trigger: proc, start: "top 80%", end: "bottom 60%", scrub: true } });

    // horizontal rail (desktop)
    var rail = $(".rail");
    if (rail) {
      ScrollTrigger.matchMedia({
        "(min-width: 961px)": function () {
          var dist = function () { return rail.scrollWidth - window.innerWidth; };
          var bar = $(".rail-progress i");
          gsap.to(rail, {
            x: function () { return -dist(); }, ease: "none",
            scrollTrigger: {
              trigger: ".rail-pin", pin: true, scrub: 0.6, start: "top top",
              end: function () { return "+=" + dist(); }, invalidateOnRefresh: true,
              onUpdate: function (s) { if (bar) bar.style.transform = "scaleX(" + s.progress + ")"; }
            }
          });
        }
      });
    }

    // parallax images
    $$("[data-parallax]").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentNode, scrub: true } });
    });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  } else {
    $$(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
    $$("[data-count]").forEach(function (el) { el.firstChild.nodeValue = Number(el.getAttribute("data-count")).toLocaleString("en-IN"); });
  }

  /* ---------------- 3D tilt + magnetic ---------------- */
  if (finePointer && !reduced) {
    $$("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt")) || 8;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-y * max) + "deg) rotateY(" + (x * max) + "deg) translateZ(0)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
    $$(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.25 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    var glow = $(".glow"), heroEl = $(".hero, .page-hero");
    if (glow && heroEl) {
      heroEl.addEventListener("pointermove", function (e) { glow.style.opacity = 1; glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; });
      heroEl.addEventListener("pointerleave", function () { glow.style.opacity = 0; });
    }
  }

  /* ---------------- tabs (industries, customers) ---------------- */
  $$("[role=tablist]").forEach(function (list) {
    var tabs = $$("[role=tab]", list);
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) { p.hidden = !on; p.classList.toggle("active", on); }
      });
      if (focus) tabs[i].focus();
      if (hasGsap) ScrollTrigger.refresh();
    }
  });

  /* ---------------- enquiry list ---------------- */
  var KEY = "pe-enquiry-v1";
  var list = store(KEY) || [];
  var drawer = $(".drawer");
  function save() { store(KEY, list); render(); }
  function find(id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return i; return -1; }
  function render() {
    var n = list.length;
    $$(".enq-count").forEach(function (c) { c.textContent = n; c.classList.add("bump"); setTimeout(function () { c.classList.remove("bump"); }, 300); });
    $$(".add-enq").forEach(function (b) {
      var on = find(b.getAttribute("data-id")) > -1;
      b.classList.toggle("added", on);
      b.setAttribute("aria-pressed", on);
      var l = $(".l", b); if (l) l.textContent = on ? "Added" : "Add to enquiry";
    });
    $$("[data-enq-list]").forEach(function (ul) {
      var empty = ul.parentNode.querySelector(".enq-empty");
      if (empty) empty.hidden = n > 0;
      ul.innerHTML = list.map(function (it) {
        return '<li data-id="' + esc(it.id) + '">' + (it.img ? '<img src="' + esc(it.img) + '" alt="" loading="lazy" width="52" height="52">' : "") +
          '<div class="t"><b>' + esc(it.name) + '</b><small>' + esc(it.cat || "") + '</small></div>' +
          '<div class="qty"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><input type="number" min="1" value="' + (it.qty || 1) + '" aria-label="Quantity for ' + esc(it.name) + '"><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>' +
          '<button type="button" class="rm" aria-label="Remove ' + esc(it.name) + '">✕</button></li>';
      }).join("");
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".add-enq");
    if (b) {
      e.preventDefault();
      var id = b.getAttribute("data-id"), i = find(id);
      if (i > -1) { list.splice(i, 1); toast("Removed from your enquiry list"); }
      else { list.push({ id: id, name: b.getAttribute("data-name"), cat: b.getAttribute("data-cat"), img: abs(b.getAttribute("data-img")), qty: 1 }); toast("Added “" + b.getAttribute("data-name") + "” to your enquiry", true); }
      save();
      return;
    }
    var li = e.target.closest("[data-enq-list] li");
    if (li) {
      var idx = find(li.getAttribute("data-id"));
      if (idx < 0) return;
      if (e.target.closest(".rm")) { list.splice(idx, 1); save(); return; }
      var q = e.target.closest("[data-q]");
      if (q) { list[idx].qty = Math.max(1, (list[idx].qty || 1) + parseInt(q.getAttribute("data-q"), 10)); save(); }
      return;
    }
    if (e.target.closest("[data-open-enquiry]")) { e.preventDefault(); openDrawer(); return; }
    if (e.target.closest("[data-close-drawer]")) { closeDrawer(); }
  });
  document.addEventListener("change", function (e) {
    var li = e.target.closest("[data-enq-list] li");
    if (li && e.target.matches("input")) { var i = find(li.getAttribute("data-id")); if (i > -1) { list[i].qty = Math.max(1, parseInt(e.target.value, 10) || 1); save(); } }
  });
  function openDrawer() { if (!drawer) return; doc.classList.add("drawer-open"); drawer.setAttribute("aria-hidden", "false"); if (lenis) lenis.stop(); setTimeout(function () { var f = $("input,button", drawer); if (f) f.focus(); }, 350); }
  function closeDrawer() { doc.classList.remove("drawer-open"); if (drawer) drawer.setAttribute("aria-hidden", "true"); if (lenis) lenis.start(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); closeLb(); } });

  var toastEl = $(".toast"), toastT;
  function toast(msg, withView) {
    if (!toastEl) return;
    $(".msg", toastEl).textContent = msg;
    $("button", toastEl).hidden = !withView;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  if (toastEl) $("button", toastEl).addEventListener("click", function () { toastEl.classList.remove("show"); openDrawer(); });

  /* ---------------- forms -> WhatsApp / e-mail ---------------- */
  function compose(form) {
    var fd = new FormData(form), lines = [];
    var subject = form.getAttribute("data-subject") || "Enquiry from website";
    lines.push(form.getAttribute("data-greeting") || "Hello Palaniappa Electronics,");
    if (form.hasAttribute("data-with-list") && list.length) {
      lines.push("", "I would like a quotation for:");
      list.forEach(function (it, i) { lines.push((i + 1) + ". " + it.name + (it.cat ? " (" + it.cat + ")" : "") + " — Qty: " + (it.qty || 1)); });
    }
    lines.push("");
    fd.forEach(function (v, k) {
      if (!String(v).trim() || k === "_hp") return;
      var lab = form.querySelector('[name="' + k + '"]');
      var label = lab && lab.getAttribute("data-label") || k;
      lines.push(label + ": " + String(v).trim());
    });
    lines.push("", "— sent from " + location.host + location.pathname);
    return { subject: subject, body: lines.join("\n") };
  }
  $$("form[data-enq-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.getAttribute("data-via")) || "wa";
      if (!form.reportValidity()) return;
      if (form.querySelector('[name="_hp"]') && form.querySelector('[name="_hp"]').value) return; // bot
      if (form.hasAttribute("data-with-list") && form.hasAttribute("data-require-list") && !list.length) { toast("Add at least one product to your enquiry list first"); return; }
      var m = compose(form);
      var url;
      if (via === "mail") url = "mailto:" + (form.getAttribute("data-mail") || CFG.mail) + "?subject=" + encodeURIComponent(m.subject) + "&body=" + encodeURIComponent(m.body);
      else url = "https://wa.me/" + (form.getAttribute("data-wa") || CFG.wa) + "?text=" + encodeURIComponent(m.body);
      var waUrl = "https://wa.me/" + (form.getAttribute("data-wa") || CFG.wa) + "?text=" + encodeURIComponent(m.body);
      var mailUrl = "mailto:" + (form.getAttribute("data-mail") || CFG.mail) + "?subject=" + encodeURIComponent(m.subject) + "&body=" + encodeURIComponent(m.body);
      var st = $(".form-status", form);
      if (st) {
        st.innerHTML = "Your enquiry is ready. If nothing opened, use one of these:" +
          '<span class="send-links"><a href="' + esc(waUrl) + '" target="_blank" rel="noopener">Open WhatsApp</a><a href="' + esc(mailUrl) + '">Open e-mail</a><button type="button" data-copy>Copy message</button></span>' +
          '<small style="display:block;margin-top:8px;opacity:.8">WhatsApp ' + esc((form.getAttribute("data-wa") || CFG.wa).replace(/^91/, "+91 ")) + ' · ' + esc(form.getAttribute("data-mail") || CFG.mail) + '</small>';
        st.classList.add("show");
        var cp = $("[data-copy]", st);
        cp.addEventListener("click", function () {
          var done = function () { cp.textContent = "Copied"; };
          var fail = function () { cp.textContent = "Copy not allowed here"; };
          try { navigator.clipboard.writeText(m.body).then(done, fail); } catch (err) { fail(); }
        });
      }
      try { if (via === "mail") location.href = url; else window.open(url, "_blank", "noopener"); } catch (err) {}
    });
  });

  /* ---------------- lightbox ---------------- */
  var lb = $(".lightbox");
  function closeLb() { if (lb && lb.classList.contains("open")) { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); if (lenis) lenis.start(); } }
  document.addEventListener("click", function (e) {
    var ph = e.target.closest(".pcard .ph");
    if (ph && lb) {
      var card = ph.closest(".pcard"), add = $(".add-enq", card), img = $("img", ph);
      $(".lb-img img", lb).src = img.currentSrc || img.src;
      $(".lb-img img", lb).alt = img.alt;
      $("h3", lb).textContent = $("h3", card).textContent;
      var p = $("p", card); $(".lb-desc", lb).textContent = p ? p.textContent : "";
      $(".lb-cat", lb).textContent = card.getAttribute("data-catname") || "";
      var lbAdd = $(".add-enq", lb);
      ["data-id", "data-name", "data-cat", "data-img"].forEach(function (a) { lbAdd.setAttribute(a, add.getAttribute(a)); });
      var link = $(".lb-link", lb), href = card.getAttribute("data-href");
      link.hidden = !href; if (href) link.href = href;
      render();
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      if (lenis) lenis.stop();
      $(".lb-close", lb).focus();
      return;
    }
    if (lb && (e.target === lb || e.target.closest(".lb-close"))) closeLb();
  });

  /* ---------------- catalogue search / filter ---------------- */
  var search = $("#cat-search");
  if (search) {
    var cards = $$(".pcard[data-search]"), blocks = $$(".cat-block"), filters = $$(".filter"), countEl = $(".result-count"), emptyEl = $(".empty");
    var active = "all";
    var params = new URLSearchParams(location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("c")) active = params.get("c");
    function apply() {
      var q = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      cards.forEach(function (c) {
        var ok = (active === "all" || c.getAttribute("data-cat") === active || c.getAttribute("data-group") === active) &&
          q.every(function (w) { return c.getAttribute("data-search").indexOf(w) > -1; });
        c.hidden = !ok; if (ok) shown++;
      });
      blocks.forEach(function (b) { b.hidden = !$(".pcard:not([hidden])", b); });
      filters.forEach(function (f) { f.setAttribute("aria-pressed", f.getAttribute("data-f") === active); });
      if (countEl) countEl.textContent = shown + " product" + (shown === 1 ? "" : "s");
      if (emptyEl) emptyEl.hidden = shown > 0;
      if (hasGsap) ScrollTrigger.refresh();
    }
    var t;
    search.addEventListener("input", function () { clearTimeout(t); t = setTimeout(apply, 120); });
    filters.forEach(function (f) { f.addEventListener("click", function () { active = f.getAttribute("data-f"); apply(); }); });
    apply();
  }

  /* ---------------- category sub-nav highlight ---------------- */
  var sublinks = $$(".subnav a");
  if (sublinks.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) sublinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", on);
          if (on) a.scrollIntoView({ block: "nearest", inline: "center" });
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".psec").forEach(function (s) { io.observe(s); });
  }

  /* ---------------- hero 3D (lazy) ---------------- */
  var hero3d = $("[data-hero3d]");
  if (hero3d && !reduced) {
    var canWebGL = (function () { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
    if (canWebGL) {
      var go = function () { import(new URL("hero3d.js", SCRIPT_SRC).href).then(function (m) { m.default(hero3d); }).catch(function () {}); };
      if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1200 }); else setTimeout(go, 400);
    }
  }

  render();
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
