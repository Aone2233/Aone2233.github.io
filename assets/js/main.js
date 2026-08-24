function toggleMenu() {
  var nav = document.querySelector(".site-header-nav");
  var btn = document.getElementById("mobile-menu-btn");
  if (!nav) return;
  var isOpen = nav.classList.toggle("is-open");
  if (btn) {
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

/* ==========================================================================
   Theme Management (Light / Dark)
   ========================================================================== */
(function () {
  var THEME_KEY = "site-theme";
  var lastAppliedTheme = null;
  var giscusThemeMap = {
    light: "light",
    dark: "dark_dimmed"
  };

  function getSystemTheme() {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }

  function resolvePreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return getSystemTheme();
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
      } catch (e) {}
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
      } catch (e) {}
    }
  }

  function applyTheme(theme) {
    var target = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", target);
    if (document.body) {
      document.body.setAttribute("data-theme", target);
    }

    var toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      var label = target === "dark" ? "切换到浅色" : "切换到深色";
      toggleBtn.setAttribute("title", label);
      toggleBtn.setAttribute("aria-label", label);
    }

    setTimeout(function () { syncThirdPartyTheme(target); }, 60);
    setTimeout(function () { syncThirdPartyTheme(target); }, 400);
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

  // 监听浏览器/系统白天夜间模式自动切换
  if (window.matchMedia) {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystemThemeChange = function (e) {
      var newTheme = e.matches ? "dark" : "light";
      applyTheme(newTheme);
      try {
        localStorage.setItem(THEME_KEY, newTheme);
      } catch (err) {}
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(onSystemThemeChange);
    }
  }

  applyTheme(resolvePreferredTheme());
  document.addEventListener("DOMContentLoaded", function () {
    bindThemeToggle();
    syncThirdPartyTheme(resolvePreferredTheme());
  });
})();

/* ==========================================================================
   Spotlight Search Modal (⌘K / Ctrl+K)
   ========================================================================== */
var searchIndexData = null;
var spotlightSelectedIndex = -1;

function toggleSpotlight(show) {
  var overlay = document.getElementById("spotlightOverlay");
  var input = document.getElementById("spotlightInput");
  if (!overlay) return;

  if (show) {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    if (input) {
      input.value = "";
      input.focus();
    }
    loadSearchData();
    renderSpotlightResults("");
  } else {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }
}

function handleSpotlightBgClick(e) {
  if (e.target.id === "spotlightOverlay") {
    toggleSpotlight(false);
  }
}

function loadSearchData() {
  if (searchIndexData) return;
  fetch("/assets/search_data.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      searchIndexData = data;
    })
    .catch(function (err) {
      console.warn("Search index load error:", err);
    });
}

function renderSpotlightResults(query) {
  var container = document.getElementById("spotlightResults");
  if (!container) return;

  if (!query || query.trim() === "") {
    container.innerHTML = '<div class="spotlight-hint">输入关键词开始检索全站内容...</div>';
    spotlightSelectedIndex = -1;
    return;
  }

  if (!searchIndexData || !searchIndexData.length) {
    container.innerHTML = '<div class="spotlight-hint">正在加载索引...</div>';
    return;
  }

  var q = query.toLowerCase().trim();
  var matches = searchIndexData.filter(function (item) {
    var matchTitle = item.title && item.title.toLowerCase().indexOf(q) !== -1;
    var matchCat = item.category && item.category.toLowerCase().indexOf(q) !== -1;
    var matchKw = item.keywords && item.keywords.toLowerCase().indexOf(q) !== -1;
    var matchContent = item.content && item.content.toLowerCase().indexOf(q) !== -1;
    return matchTitle || matchCat || matchKw || matchContent;
  }).slice(0, 10);

  if (!matches.length) {
    container.innerHTML = '<div class="spotlight-hint">未找到与 “' + query + '” 匹配的内容</div>';
    spotlightSelectedIndex = -1;
    return;
  }

  var html = "";
  matches.forEach(function (item, idx) {
    var cat = item.category ? '<span class="spotlight-item-cat">' + item.category + '</span>' : '';
    html += '<a href="' + item.url + '" class="spotlight-item ' + (idx === 0 ? 'selected' : '') + '" data-idx="' + idx + '">';
    html += '  <span>' + item.title + '</span>';
    html += '  ' + cat;
    html += '</a>';
  });

  container.innerHTML = html;
  spotlightSelectedIndex = 0;
}

/* ==========================================================================
   Interactive Clapping & Share Toast
   ========================================================================== */
var clapCountNum = 42;
function handleClap(btn) {
  clapCountNum++;
  var countSpan = document.getElementById("clapCount");
  if (countSpan) countSpan.textContent = clapCountNum;

  btn.style.transform = "scale(1.2) rotate(-5deg)";
  setTimeout(function () {
    btn.style.transform = "";
  }, 180);

  showToast("👏 感谢你的点赞鼓励！");
}

function shareArticle() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(function () {
      showToast("🔗 文章链接已复制到剪贴板");
    });
  } else {
    showToast("🔗 文章链接已生成");
  }
}

function showToast(text) {
  var toast = document.getElementById("toastMsg");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}

/* ==========================================================================
   DOM Ready Handlers
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Reading Progress Bar
  var progressBar = document.getElementById("reading-progress-bar");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (window.scrollY / total) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    }, { passive: true });
  }

  // 2. Dynamic Sliding Pill TOC Indicator
  function updateTocPill() {
    var headings = document.querySelectorAll(".article-content h1, .article-content h2, .article-content h3, .markdown-body h1, .markdown-body h2, .markdown-body h3");
    var tocLinks = document.querySelectorAll(".post-directory a");
    var tocPill = document.getElementById("tocPill");
    if (!headings.length || !tocLinks.length || !tocPill) return;

    var scrollPos = window.scrollY + 120;
    var activeHeading = null;

    headings.forEach(function (h) {
      if (h.id && h.offsetTop <= scrollPos) {
        activeHeading = h;
      }
    });

    if (!activeHeading && headings.length) activeHeading = headings[0];

    if (activeHeading) {
      var activeId = activeHeading.id;
      tocLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (href && (href === "#" + activeId || decodeURIComponent(href) === "#" + activeId)) {
          link.classList.add("current");
          var itemEle = link.parentElement;
          if (itemEle) {
            tocPill.style.transform = "translateY(" + itemEle.offsetTop + "px)";
            tocPill.style.height = itemEle.offsetHeight + "px";
          }
        } else {
          link.classList.remove("current");
        }
      });
    }
  }

  window.addEventListener("scroll", updateTocPill, { passive: true });
  setTimeout(updateTocPill, 300);

  // 3. Inject Heading Anchor Links
  var articleHeadings = document.querySelectorAll(".article-content h1, .article-content h2, .article-content h3, .markdown-body h1, .markdown-body h2, .markdown-body h3");
  articleHeadings.forEach(function (h) {
    if (h.id) {
      var a = document.createElement("a");
      a.className = "heading-anchor";
      a.href = "#" + h.id;
      a.textContent = "#";
      a.setAttribute("aria-hidden", "true");
      h.prepend(a);
    }
  });

  // 4. Spotlight Input Typing Listener
  var spotlightInput = document.getElementById("spotlightInput");
  if (spotlightInput) {
    spotlightInput.addEventListener("input", function (e) {
      renderSpotlightResults(e.target.value);
    });
  }

  // 5. Global Keyboard Shortcuts (Cmd+K, J/K navigation, ESC, Enter)
  var selectedPostIdx = -1;
  window.addEventListener("keydown", function (e) {
    var overlay = document.getElementById("spotlightOverlay");
    var isSpotlightOpen = overlay && overlay.classList.contains("active");

    // Cmd+K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      toggleSpotlight(!isSpotlightOpen);
      return;
    }

    // ESC
    if (e.key === "Escape") {
      if (isSpotlightOpen) {
        toggleSpotlight(false);
      }
      return;
    }

    // Inside Spotlight Modal navigation
    if (isSpotlightOpen) {
      var items = document.querySelectorAll(".spotlight-item");
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        spotlightSelectedIndex = (spotlightSelectedIndex + 1) % items.length;
        updateSpotlightSelection(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        spotlightSelectedIndex = (spotlightSelectedIndex - 1 + items.length) % items.length;
        updateSpotlightSelection(items);
      } else if (e.key === "Enter") {
        if (spotlightSelectedIndex >= 0 && items[spotlightSelectedIndex]) {
          e.preventDefault();
          items[spotlightSelectedIndex].click();
        }
      }
      return;
    }

    // Home Feed J / K Navigation
    var postItems = document.querySelectorAll(".post-feed .post-item");
    if (postItems.length && !isSpotlightOpen) {
      if (e.key === "j" || e.key === "J") {
        selectedPostIdx = Math.min(postItems.length - 1, selectedPostIdx + 1);
        highlightFeedItem(postItems);
      } else if (e.key === "k" || e.key === "K") {
        selectedPostIdx = Math.max(0, selectedPostIdx - 1);
        highlightFeedItem(postItems);
      } else if (e.key === "Enter" && selectedPostIdx >= 0) {
        var link = postItems[selectedPostIdx].querySelector(".post-title a");
        if (link) link.click();
      }
    }
  });

  function updateSpotlightSelection(items) {
    items.forEach(function (it, idx) {
      if (idx === spotlightSelectedIndex) {
        it.classList.add("selected");
        it.scrollIntoView({ block: "nearest" });
      } else {
        it.classList.remove("selected");
      }
    });
  }

  function highlightFeedItem(posts) {
    posts.forEach(function (p, idx) {
      if (idx === selectedPostIdx) {
        p.classList.add("keyboard-selected");
        p.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        p.classList.remove("keyboard-selected");
      }
    });
  }

  // 6. Code Block Copy Enhancement
  var codeBlocks = document.querySelectorAll(".markdown-body pre, .article-content pre");
  codeBlocks.forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "btn-copy-code";
    btn.textContent = "复制";
    btn.type = "button";
    btn.title = "复制代码";

    btn.addEventListener("click", function () {
      var code = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = "✓ 已复制";
          btn.style.color = "#10b981";
          btn.style.borderColor = "#10b981";
          setTimeout(function () {
            btn.textContent = "复制";
            btn.style.color = "";
            btn.style.borderColor = "";
          }, 1800);
        });
      }
    });

    pre.style.position = "relative";
    pre.appendChild(btn);
  });
});
