function toggleMenu() {
  var nav = document.getElementsByClassName("site-header-nav")[0];
  if (nav.style.display == "inline-flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "inline-flex";
  }
}

(function () {
  var THEME_KEY = "site-theme";

  function resolvePreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }

  function applyTheme(theme) {
    var target = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", target);
    if (document.body) {
      document.body.setAttribute("data-theme", target);
    }

    var icon = document.querySelector(".theme-toggle-icon");
    var text = document.querySelector(".theme-toggle-text");
    if (icon) icon.textContent = target === "dark" ? "☀️" : "🌙";
    if (text) text.textContent = target === "dark" ? "浅色" : "深色";
  }

  function bindThemeToggle() {
    var toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var nextTheme = current === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (e) {}
    });
  }

  applyTheme(resolvePreferredTheme());
  document.addEventListener("DOMContentLoaded", bindThemeToggle);
})();

jQuery(function() {
  // 回到顶部
  function toTop () {
    var $toTop = $(".gotop");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() >= $(window).height()) {
        $toTop.css("display", "block").fadeIn();
      } else {
        $toTop.fadeOut();
      }
    });

    $toTop.on("click", function (evt) {
      var $obj = $("body,html");
      $obj.animate({
        scrollTop: 0
      }, 240);

      evt.preventDefault();
    });
  }

  function headerScrollEffect () {
    var $header = $(".site-header");
    if ($header.length === 0) return;

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 8) {
        $header.addClass("is-scrolled");
      } else {
        $header.removeClass("is-scrolled");
      }
    }).trigger("scroll");
  }

  function optimizeImages () {
    $(".markdown-body img, .gallery img, .repo-list-item img").each(function () {
      if (!this.getAttribute("loading")) this.setAttribute("loading", "lazy");
      if (!this.getAttribute("decoding")) this.setAttribute("decoding", "async");
    });
  }

  function revealCards () {
    var cards = document.querySelectorAll(".repo-list-item");
    if (!cards.length) return;

    if (!("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function(card) {
      card.classList.add("reveal-ready");
      io.observe(card);
    });
  }

  toTop();
  headerScrollEffect();
  optimizeImages();
  revealCards();
});
