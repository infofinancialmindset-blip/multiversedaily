/* Anteprima personalizzata dell'editor.
 *
 * Mostra due cose che l'anteprima predefinita di Decap non dà:
 *  1. la CARD come apparirà in home, con il ritaglio 16:9 reale — così si
 *     vede subito se la foto viene tagliata male e si corregge con il campo
 *     "Inquadratura copertina";
 *  2. l'ARTICOLO con la grafica del sito (badge, tipografia, tema scuro).
 *
 * Usa le globali esposte dal bundle Decap: `h` (createElement) e `CMS`.
 */
(function () {
  var h = window.h;
  var CMS = window.CMS;

  CMS.registerPreviewStyle("/admin/preview.css");

  var CATEGORIES = {
    news: { label: "News", accent: "#22c55e" },
    leak: { label: "Leak", accent: "#f5c518" },
    teorie: { label: "Teorie & Approfondimenti", accent: "#f472b6" },
    recensioni: { label: "Recensioni", accent: "#a855f7" },
    guide: { label: "Guida evergreen", accent: "#21c6a8" },
  };

  var UNIVERSES = {
    mcu: { label: "Marvel", accent: "#e8283f" },
    dc: { label: "DC", accent: "#2f6fff" },
    altro: { label: "Altro", accent: "#9aa1b2" },
  };

  var MONTHS = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ];

  function formatDate(value) {
    if (!value) return "";
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  /** Stima il tempo di lettura come fa il sito (~200 parole al minuto). */
  function readingTime(markdown) {
    var words = String(markdown || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200)) + " min di lettura";
  }

  function badge(text, accent, filled) {
    var style = filled
      ? { background: accent, color: "#fff" }
      : {
          color: accent,
          background: "color-mix(in srgb, " + accent + " 12%, transparent)",
          border: "1px solid color-mix(in srgb, " + accent + " 40%, transparent)",
        };
    var children = [text];
    if (!filled) {
      children = [
        h("span", { className: "mdp-dot", style: { background: accent }, key: "d" }),
        text,
      ];
    }
    return h(
      "span",
      { className: "mdp-badge" + (filled ? " mdp-badge-universe" : ""), style: style },
      children
    );
  }

  function makePreview(categoryKey) {
    return function Preview(props) {
      var entry = props.entry;
      var get = function (field) {
        var v = entry.getIn(["data", field]);
        return v && v.toJS ? v.toJS() : v;
      };

      var title = get("title");
      var excerpt = get("excerpt");
      var author = get("author");
      var universeKey = get("universe") || "mcu";
      var coverPosition = get("coverPosition") || "center";
      var publishedAt = get("publishedAt");
      var image = get("coverImage");
      var body = get("body");

      var category = CATEGORIES[categoryKey] || CATEGORIES.news;
      var universe = UNIVERSES[universeKey] || UNIVERSES.altro;

      // getAsset risolve anche le immagini appena caricate e non ancora salvate.
      var imageUrl = image ? props.getAsset(image) : null;
      var imgStyle = { objectPosition: coverPosition };

      function media(className) {
        if (imageUrl) {
          return h("div", { className: className }, [
            h("img", { src: String(imageUrl), style: imgStyle, alt: "", key: "i" }),
          ]);
        }
        return h(
          "div",
          { className: className },
          h(
            "div",
            { className: "mdp-empty", style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: "none" } },
            "Nessuna immagine di copertina"
          )
        );
      }

      var badges = h("div", { className: "mdp-badges" }, [
        h("span", { key: "u" }, badge(universe.label, universe.accent, true)),
        h("span", { key: "c" }, badge(category.label, category.accent, false)),
      ]);

      return h("div", { className: "mdp" }, [
        // 1. Come appare nella home / negli elenchi
        h("div", { className: "mdp-section-label", key: "l1" }, "Come apparirà negli elenchi"),
        h("div", { className: "mdp-card", key: "card" }, [
          media("mdp-card-media"),
          h("div", { className: "mdp-card-body", key: "b" }, [
            h("div", { key: "bd" }, badges),
            h("div", { className: "mdp-card-title", key: "t" }, title || "Titolo dell'articolo"),
            h("p", { className: "mdp-card-excerpt", key: "e" }, excerpt || "L'estratto comparirà qui."),
          ]),
        ]),

        // 2. Come appare la pagina dell'articolo
        h("div", { className: "mdp-section-label", key: "l2" }, "Come apparirà la pagina dell'articolo"),
        h("div", { key: "art" }, [
          h("div", { key: "bd2" }, badges),
          h("h1", { className: "mdp-title", key: "t2" }, title || "Titolo dell'articolo"),
          h("p", { className: "mdp-excerpt", key: "e2" }, excerpt || ""),
          h("div", { className: "mdp-meta", key: "m" }, [
            h("span", { key: "a" }, author ? "Di " + author : ""),
            h("span", { key: "d" }, formatDate(publishedAt)),
            h("span", { key: "r" }, readingTime(body)),
          ]),
          media("mdp-hero"),
          h("div", { className: "mdp-body", key: "body" }, props.widgetFor("body")),
        ]),
      ]);
    };
  }

  ["news", "leak", "teorie", "recensioni", "guide"].forEach(function (name) {
    CMS.registerPreviewTemplate(name, makePreview(name));
  });
})();
