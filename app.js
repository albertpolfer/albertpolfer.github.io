/* =========================================================================
   Albert Polo — script compartido. Sin dependencias.
   ========================================================================= */
(function () {
  "use strict";

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

  /* ---- Botones que abren el diálogo de impresión ---- */
  each("[data-print]", function (btn) {
    btn.addEventListener("click", function (ev) { ev.preventDefault(); window.print(); });
  });

  /* ---- Un plan preselecciona su nombre en el formulario ---- */
  each("[data-plan]", function (btn) {
    btn.addEventListener("click", function () {
      var sel = document.getElementById("plan");
      if (sel) { sel.value = btn.getAttribute("data-plan"); }
    });
  });

  /* ---- Formulario: compone el correo en el cliente local.
          No se envía nada a ningún servidor ni se guarda nada. ---- */
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
      var order = ["nombre", "despacho", "correo", "telefono", "comunidades", "plan"];
      var names = {
        nombre: "Nombre", despacho: "Despacho", correo: "Correo",
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

  /* ---- Aparición al hacer scroll, respetando prefers-reduced-motion ---- */
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealed = [];

  if (!calm && "IntersectionObserver" in window) {
    revealed = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    revealed.forEach(function (n) {
      n.style.transition = "opacity 640ms cubic-bezier(.22,.61,.36,1), transform 640ms cubic-bezier(.22,.61,.36,1)";
      n.style.opacity = "0";
      n.style.transform = "translateY(14px)";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealed.forEach(function (n) { io.observe(n); });
  }

  /* ---- Nada invisible al imprimir ---- */
  window.addEventListener("beforeprint", function () {
    revealed.forEach(function (n) { n.style.opacity = "1"; n.style.transform = "none"; });
  });
})();
