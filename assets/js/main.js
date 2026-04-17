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
  var lastAppliedTheme = null;
  var giscusThemeMap = {
    light: "light",
    dark: "dark_dimmed"
  };

  function resolvePreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }

  function syncThirdPartyTheme(theme) {
    var target = theme === "dark" ? "dark" : "light";
    var giscusTheme = giscusThemeMap[target];

    var giscusScript = document.querySelector('script[src*="giscus.app/client.js"]');
    if (giscusScript) {
      giscusScript.setAttribute("data-theme", giscusTheme);
    }

    var giscusFrame = document.querySelector("iframe.giscus-frame");
    if (giscusFrame && giscusFrame.contentWindow) {
      var postTheme = function () {
        giscusFrame.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: giscusTheme
              }
            }
          },
          "https://giscus.app"
        );
      };
      postTheme();
      setTimeout(postTheme, 120);
      setTimeout(postTheme, 600);
    }

    var utterancesFrame = document.querySelector("iframe.utterances-frame");
    if (utterancesFrame && utterancesFrame.contentWindow) {
      utterancesFrame.contentWindow.postMessage(
        {
          type: "set-theme",
          theme: target === "dark" ? "github-dark" : "github-light"
        },
        "https://utteranc.es"
      );
    }
  }

  function forceRebuildGiscus(theme) {
    var target = theme === "dark" ? "dark" : "light";
    var giscusTheme = giscusThemeMap[target];
    var giscusScript = document.querySelector('script[src*="giscus.app/client.js"]');
    if (!giscusScript || !giscusScript.parentElement) return;

    var parent = giscusScript.parentElement;
    var hasLoadedFrame = parent.querySelector("iframe.giscus-frame");
    if (!hasLoadedFrame) return;

    var fresh = document.createElement("script");
    fresh.src = "https://giscus.app/client.js";
    fresh.async = true;
    fresh.crossOrigin = "anonymous";

    Array.prototype.forEach.call(giscusScript.attributes, function (attr) {
      if (attr.name === "src" || attr.name === "async" || attr.name === "crossorigin") return;
      fresh.setAttribute(attr.name, attr.value);
    });
    fresh.setAttribute("data-theme", giscusTheme);

    parent.innerHTML = "";
    parent.appendChild(fresh);
  }

  function forceRebuildGiscusWhenReady(theme, retries) {
    if (document.querySelector("iframe.giscus-frame")) {
      forceRebuildGiscus(theme);
      return;
    }
    if (!retries || retries <= 0) return;
    setTimeout(function () {
      forceRebuildGiscusWhenReady(theme, retries - 1);
    }, 600);
  }

  function observeCommentWidgets() {
    if (!("MutationObserver" in window) || !document.body) return;
    var observer = new MutationObserver(function () {
      var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      syncThirdPartyTheme(current);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyTheme(theme) {
    var target = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", target);
    if (document.body) {
      document.body.setAttribute("data-theme", target);
    }

    var icon = document.querySelector(".theme-toggle-icon");
    var text = document.querySelector(".theme-toggle-text");
    var toggleBtn = document.getElementById("theme-toggle");
    if (icon) icon.textContent = target === "dark" ? "☀️" : "🌙";
    if (text) text.textContent = target === "dark" ? "浅色" : "深色";
    if (toggleBtn) {
      var label = target === "dark" ? "切换到浅色" : "切换到深色";
      toggleBtn.setAttribute("title", label);
      toggleBtn.setAttribute("aria-label", label);
    }

    setTimeout(function () {
      syncThirdPartyTheme(target);
    }, 60);
    setTimeout(function () {
      syncThirdPartyTheme(target);
    }, 400);
    setTimeout(function () {
      syncThirdPartyTheme(target);
    }, 900);

    var shouldRebuildGiscus = target === "dark" || (lastAppliedTheme !== null && lastAppliedTheme !== target);
    if (shouldRebuildGiscus) {
      setTimeout(function () {
        forceRebuildGiscusWhenReady(target, target === "dark" ? 4 : 2);
      }, 900);
    }
    lastAppliedTheme = target;
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
  document.addEventListener("DOMContentLoaded", function () {
    bindThemeToggle();
    observeCommentWidgets();
    syncThirdPartyTheme(resolvePreferredTheme());
  });
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
