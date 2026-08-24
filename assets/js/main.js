function toggleMenu() {
  var nav = document.querySelector(".site-header-nav");
  var btn = document.getElementById("mobile-menu-btn");
  if (!nav) return;
  var isOpen = nav.classList.toggle("is-open");
  if (btn) {
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
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

    var postGiscusTheme = function (frame) {
      if (!frame || !frame.contentWindow) return;
      try {
        frame.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: giscusTheme
              }
            }
          },
          "https://giscus.app"
        );
      } catch (e) {
        /* 忽略 iframe 尚不可达或跨域不可投递的场景 */
      }
    };

    var giscusFrame = document.querySelector("iframe.giscus-frame");
    if (giscusFrame && giscusFrame.contentWindow) {
      postGiscusTheme(giscusFrame);
      setTimeout(function () { postGiscusTheme(giscusFrame); }, 120);
      setTimeout(function () { postGiscusTheme(giscusFrame); }, 600);
    }

    var utterancesFrame = document.querySelector("iframe.utterances-frame");
    if (utterancesFrame && utterancesFrame.contentWindow) {
      try {
        utterancesFrame.contentWindow.postMessage(
          {
            type: "set-theme",
            theme: target === "dark" ? "github-dark" : "github-light"
          },
          "https://utteranc.es"
        );
      } catch (e) {
        /* 忽略 iframe 尚不可达或跨域不可投递的场景 */
      }
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

document.addEventListener("DOMContentLoaded", function () {
  // 回到顶部
  function toTop() {
    var toTopBtn = document.querySelector(".gotop");
    if (!toTopBtn) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY >= window.innerHeight * 0.75) {
        toTopBtn.style.display = "block";
      } else {
        toTopBtn.style.display = "none";
      }
    }, { passive: true });

    toTopBtn.addEventListener("click", function (evt) {
      evt.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 导航栏滚动毛玻璃增强效果
  function headerScrollEffect() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var checkScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }

  // 图片懒加载与异步解码属性注入
  function optimizeImages() {
    var images = document.querySelectorAll(".markdown-body img, .gallery img, .repo-list-item img");
    images.forEach(function (img) {
      if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });
  }

  // 卡片进入视口动效
  function revealCards() {
    var cards = document.querySelectorAll(".repo-list-item");
    if (!cards.length) return;

    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (card) { card.classList.add("in-view"); });
      return;
    }

    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function (card) {
      card.classList.add("reveal-ready");
      io.observe(card);
    });
  }

  // 文章顶部阅读进度条
  function initReadingProgressBar() {
    var bar = document.getElementById("reading-progress-bar");
    var article = document.querySelector(".article-content, .markdown-body");
    if (!bar || !article) return;

    var updateProgress = function () {
      var rect = article.getBoundingClientRect();
      var totalScroll = article.scrollHeight - window.innerHeight;
      var currentOffset = -rect.top;
      if (currentOffset <= 0) {
        bar.style.width = "0%";
      } else if (currentOffset >= totalScroll) {
        bar.style.width = "100%";
      } else {
        var pct = Math.min(100, Math.max(0, (currentOffset / totalScroll) * 100));
        bar.style.width = pct.toFixed(1) + "%";
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // 目录导航滚动跟随高亮 (Scrollspy)
  function initTocScrollspy() {
    var tocLinks = document.querySelectorAll(".post-directory a");
    var headings = document.querySelectorAll(".article-content h1, .article-content h2, .article-content h3, .article-content h4, .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4");
    if (!tocLinks.length || !headings.length) return;

    var onScroll = function () {
      var scrollPos = window.scrollY + 130;
      var activeId = "";

      headings.forEach(function (h) {
        if (h.id && h.offsetTop <= scrollPos) {
          activeId = h.id;
        }
      });

      if (!activeId) return;

      tocLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (href && (href === "#" + activeId || decodeURIComponent(href) === "#" + activeId)) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  toTop();
  headerScrollEffect();
  optimizeImages();
  revealCards();
  initReadingProgressBar();
  initTocScrollspy();
});
