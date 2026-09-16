(function () {
  "use strict";

  const storageKey = "prompt-optimizer-legal-language";
  const supported = ["zh", "en"];

  function requestedLanguage() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("lang");
    if (supported.includes(query)) return query;

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (supported.includes(saved)) return saved;
    } catch (_) {}

    return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function setLanguage(language, persist) {
    const next = supported.includes(language) ? language : "zh";
    document.documentElement.dataset.language = next;
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-set-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLanguage === next));
    });

    document.querySelectorAll("[data-title-zh]").forEach((element) => {
      document.title = next === "zh" ? element.dataset.titleZh : element.dataset.titleEn;
    });

    if (persist) {
      try { window.localStorage.setItem(storageKey, next); } catch (_) {}
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url);
    }
  }

  document.querySelectorAll("[data-set-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.setLanguage, true));
  });

  setLanguage(requestedLanguage(), false);
})();
