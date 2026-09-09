/* =========================================================================
   Albert Polo — script compartido. Sin dependencias.
   ========================================================================= */
(function () {
  "use strict";

  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---- Correo ofuscado: no hay ningún mailto: en el HTML servido ---- */
  var parts = ["albertpolfer", "gmail", "com"];
  var addr = parts[0] + String.fromCharCode(64) + parts[1] + "." + parts[2];
  var proto = "mai" + "lto:";

  function each(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }

  each("[data-mail]", function (btn) {
    var label = btn.querySelector("[data-mail-text]");
    if (label) { label.textContent = addr; }
    btn.setAttribute("aria-label", "Escribir a " + addr);
    btn.addEventListener("click", function () { window.location.href = proto + addr; });
  });

  each("[data-copy]", function (btn) {
    btn.addEventListener("click", function () {
      var original = btn.textContent;
      var done = function () {
        btn.textContent = "Copiado";
        setTimeout(function () { btn.textContent = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else {
        var t = document.createElement("textarea");
        t.value = addr;
        document.body.appendChild(t);
        t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t);
        done();
      }
    });
  });

  each("[data-print]", function (btn) {
    btn.addEventListener("click", function (ev) { ev.preventDefault(); window.print(); });
  });

  each("[data-plan]", function (btn) {
    btn.addEventListener("click", function () {
      var sel = document.getElementById("plan");
      if (sel) { sel.value = btn.getAttribute("data-plan"); }
    });
  });

  /* ---- Formulario: compone el correo en el cliente local. ---- */
  var form = document.querySelector("[data-mailform]");
  if (form) {
    var status = form.querySelector(".formstatus");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var get = function (k) { return (d.get(k) || "").toString().trim(); };

      var nombre = get("nombre");
      var correo = get("correo");
      var mensaje = get("mensaje");

      if (!nombre || !correo || !mensaje) {
        status.textContent = "Rellena nombre, correo y mensaje.";
        return;
      }
      if (correo.indexOf("@") < 1 || correo.lastIndexOf(".") < correo.indexOf("@")) {
        status.textContent = "Ese correo no parece válido.";
        return;
      }

      var lines = [];
      var order = ["nombre", "despacho", "empresa", "correo", "telefono", "comunidades", "plan"];
      var names = {
        nombre: "Nombre", despacho: "Despacho", empresa: "Empresa", correo: "Correo",
        telefono: "Teléfono", comunidades: "Comunidades que gestiona", plan: "Plan de interés"
      };
      order.forEach(function (k) {
        if (d.has(k)) { lines.push(names[k] + ": " + (get(k) || "—")); }
      });
      lines.push("");
      lines.push(mensaje);

      var subject = form.getAttribute("data-subject") || "Contacto desde la web";
      var plan = get("plan");
      if (plan) { subject += " — " + plan; }

      status.textContent = "Abriendo tu programa de correo…";
      window.location.href = proto + addr +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  /* ---- Navbar al scroll y menú móvil ---- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  function setScrolled() {
    if (!header) { return; }
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    each(".site-nav a", function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Aparición al hacer scroll ---- */
  var revealed = [];

  if (!calm && "IntersectionObserver" in window) {
    revealed = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    revealed.forEach(function (n) {
      n.style.transition = "opacity 700ms cubic-bezier(.22,.61,.36,1), transform 700ms cubic-bezier(.22,.61,.36,1)";
      n.style.opacity = "0";
      n.style.transform = "translateY(18px)";
    });

    each("[data-stagger]", function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.transition = "opacity 640ms cubic-bezier(.22,.61,.36,1), transform 640ms cubic-bezier(.22,.61,.36,1)";
        child.style.transitionDelay = (i * 90) + "ms";
        child.style.opacity = "0";
        child.style.transform = "translateY(16px)";
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.style.opacity = "1";
        e.target.style.transform = "none";
        var group = e.target.hasAttribute("data-stagger") ? e.target : e.target.querySelector("[data-stagger]");
        if (group) {
          Array.prototype.forEach.call(group.children, function (child) {
            child.style.opacity = "1";
            child.style.transform = "none";
          });
        }
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealed.forEach(function (n) { io.observe(n); });
  }

  /* ---- Contadores ---- */
  if (!calm && "IntersectionObserver" in window) {
    var nums = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var start = performance.now();
        var dur = 1100;
        function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          var val = Math.round(target * eased);
          el.textContent = prefix + val + suffix;
          if (t < 1) { requestAnimationFrame(tick); }
        }
        requestAnimationFrame(tick);
        nio.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { nio.observe(n); });
  }

  /* ---- Inclinación suave al cursor ---- */
  if (!calm && window.matchMedia("(pointer: fine)").matches) {
    each("[data-tilt]", function (el) {
      el.addEventListener("pointermove", function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + (x * 5) + "deg) rotateX(" + (-y * 5) + "deg)";
      });
      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---- Parallax muy sutil ---- */
  if (!calm) {
    var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (layers.length) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        layers.forEach(function (el) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
          el.style.transform = "translateY(" + (y * speed * 0.15) + "px)";
        });
      }, { passive: true });
    }
  }

  window.addEventListener("beforeprint", function () {
    revealed.forEach(function (n) { n.style.opacity = "1"; n.style.transform = "none"; });
  });
})();
