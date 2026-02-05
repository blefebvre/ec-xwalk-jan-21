var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/headband.js
  function parse(element, { document }) {
    const cells = [];
    const links = element.querySelectorAll("a");
    links.forEach((link) => {
      const row = [];
      const cell = document.createElement("div");
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.textContent.trim();
      cell.appendChild(anchor);
      row.push(cell);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "headband",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse2(element, { document }) {
    const cells = [];
    const imageRow = [];
    const imageCell = document.createElement("div");
    imageCell.appendChild(document.createComment("field:image"));
    const bgStyle = element.querySelector('[style*="background-image"]');
    if (bgStyle) {
      const bgMatch = bgStyle.getAttribute("style").match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch) {
        const img = document.createElement("img");
        img.src = bgMatch[1];
        img.alt = "Hero background";
        imageCell.appendChild(img);
      }
    }
    imageRow.push(imageCell);
    cells.push(imageRow);
    const contentRow = [];
    const contentCell = document.createElement("div");
    contentCell.appendChild(document.createComment("field:text"));
    const eyebrow = element.querySelector("h3");
    if (eyebrow) {
      const eyebrowEl = document.createElement("p");
      eyebrowEl.textContent = eyebrow.textContent.trim();
      contentCell.appendChild(eyebrowEl);
    }
    const heading = element.querySelector("h2");
    if (heading) {
      const headingEl = document.createElement("h1");
      headingEl.textContent = heading.textContent.trim();
      contentCell.appendChild(headingEl);
    }
    const paragraphs = element.querySelectorAll("p:not(.legal-text)");
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text && text.length > 10) {
        const descP = document.createElement("p");
        descP.textContent = text;
        contentCell.appendChild(descP);
      }
    });
    const cta = element.querySelector('a.att-button, a[class*="button"]');
    if (cta) {
      const ctaP = document.createElement("p");
      const anchor = document.createElement("a");
      anchor.href = cta.href;
      anchor.textContent = cta.textContent.trim();
      ctaP.appendChild(anchor);
      contentCell.appendChild(ctaP);
    }
    contentRow.push(contentCell);
    cells.push(contentRow);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-offer.js
  function parse3(element, { document }) {
    const text = element.textContent.toLowerCase();
    const isOfferContent = text.includes("shop now") || text.includes("$") || text.includes("get iphone") || text.includes("break your contract") || text.includes("save 25%") || text.includes("families save");
    if (!isOfferContent) {
      return;
    }
    const cells = [];
    let cards = element.querySelectorAll(".card-tile");
    if (cards.length === 0) {
      cards = element.querySelectorAll('[class*="offer"]');
    }
    if (cards.length === 0) {
      cards = element.querySelectorAll('[class*="card"]');
    }
    if (cards.length === 0) {
      cards = element.querySelectorAll(":scope > div");
    }
    cards.forEach((card, index) => {
      const row = [];
      const imageCell = document.createElement("div");
      imageCell.appendChild(document.createComment("field:image"));
      const img = card.querySelector("img");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "offer image";
        imageCell.appendChild(newImg);
      }
      row.push(imageCell);
      const contentCell = document.createElement("div");
      contentCell.appendChild(document.createComment("field:text"));
      let eyebrow = card.querySelector(".eyebrow");
      if (!eyebrow) eyebrow = card.querySelector('[class*="eyebrow"]');
      if (!eyebrow) eyebrow = card.querySelector("span:first-of-type");
      if (eyebrow) {
        const eyebrowP = document.createElement("p");
        eyebrowP.textContent = eyebrow.textContent.trim();
        contentCell.appendChild(eyebrowP);
      }
      let heading = card.querySelector(".heading");
      if (!heading) heading = card.querySelector('[class*="heading"]');
      if (!heading) heading = card.querySelector("h2, h3, h4");
      if (heading) {
        const headingEl = document.createElement("h3");
        headingEl.textContent = heading.textContent.trim();
        contentCell.appendChild(headingEl);
      }
      const allPs = card.querySelectorAll("p");
      allPs.forEach((p) => {
        if (!p.classList.contains("eyebrow") && !p.classList.contains("heading")) {
          const descP = document.createElement("p");
          descP.textContent = p.textContent.trim();
          if (descP.textContent) {
            contentCell.appendChild(descP);
          }
        }
      });
      const allLinks = card.querySelectorAll("a");
      allLinks.forEach((link) => {
        const linkText = link.textContent.trim();
        if (linkText && !link.querySelector("img")) {
          const ctaP = document.createElement("p");
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.textContent = linkText;
          ctaP.appendChild(anchor);
          contentCell.appendChild(ctaP);
        }
      });
      if (imageCell.children.length > 0 || contentCell.children.length > 0) {
        row.push(contentCell);
        cells.push(row);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Cards Offer",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-icons.js
  function parse4(element, { document }) {
    const cells = [];
    let columns = element.querySelectorAll(".ig-block");
    if (columns.length === 0) {
      columns = element.querySelectorAll(":scope > div");
    }
    columns.forEach((col, index) => {
      const row = [];
      const iconCell = document.createElement("div");
      iconCell.appendChild(document.createComment("field:icon"));
      const icon = col.querySelector("img");
      if (icon) {
        const newImg = document.createElement("img");
        newImg.src = icon.src;
        newImg.alt = icon.alt || "icon";
        iconCell.appendChild(newImg);
      }
      row.push(iconCell);
      const textCell = document.createElement("div");
      textCell.appendChild(document.createComment("field:text"));
      const paragraphs = col.querySelectorAll("p");
      const titleEl = col.querySelector(".icon-grid-icon-title") || paragraphs[0];
      if (titleEl) {
        const title = document.createElement("h4");
        title.textContent = titleEl.textContent.trim();
        textCell.appendChild(title);
      }
      const descEl = col.querySelector(".icon-grid-icon-description") || paragraphs[1];
      if (descEl && descEl !== titleEl) {
        const desc = document.createElement("p");
        desc.textContent = descEl.textContent.trim();
        textCell.appendChild(desc);
      }
      row.push(textCell);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns (icons)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse5(element, { document }) {
    const text = element.textContent.toLowerCase();
    const isNewsContent = text.includes("read more") || text.includes("product launch") || text.includes("health and wellness") || text.includes("law enforcement") || text.includes("firstnet fusion") || text.includes("stress relief") || text.includes("town of duck");
    if (!isNewsContent) {
      return;
    }
    const cells = [];
    let cards = element.querySelectorAll(".card-tile");
    if (cards.length === 0) {
      cards = element.querySelectorAll(":scope > div");
    }
    cards.forEach((card, index) => {
      const row = [];
      const imageCell = document.createElement("div");
      imageCell.appendChild(document.createComment("field:image"));
      const img = card.querySelector("img");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "news image";
        imageCell.appendChild(newImg);
      }
      row.push(imageCell);
      const contentCell = document.createElement("div");
      contentCell.appendChild(document.createComment("field:text"));
      const eyebrow = card.querySelector('.eyebrow, [class*="eyebrow"]');
      if (eyebrow) {
        const eyebrowP = document.createElement("p");
        eyebrowP.textContent = eyebrow.textContent.trim();
        contentCell.appendChild(eyebrowP);
      }
      const heading = card.querySelector(".heading, h2, h3, h4");
      if (heading) {
        const headingEl = document.createElement("h3");
        headingEl.textContent = heading.textContent.trim();
        contentCell.appendChild(headingEl);
      }
      const desc = card.querySelector("p:not(.eyebrow):not(.heading)");
      if (desc) {
        const descP = document.createElement("p");
        descP.textContent = desc.textContent.trim();
        contentCell.appendChild(descP);
      }
      const link = card.querySelector("a");
      if (link) {
        const linkP = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = link.textContent.trim() || "Read more";
        linkP.appendChild(anchor);
        contentCell.appendChild(linkP);
      }
      row.push(contentCell);
      cells.push(row);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Cards News",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/form-newsletter.js
  function parse6(element, { document }) {
    const cells = [];
    const headingCell = document.createElement("div");
    headingCell.appendChild(document.createComment("field:heading"));
    const eyebrow = element.querySelector('.eyebrow, [class*="eyebrow"], .label');
    const heading = element.querySelector("h2, h3");
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      headingCell.appendChild(p);
    } else if (heading) {
      const p = document.createElement("p");
      p.textContent = heading.textContent.trim();
      headingCell.appendChild(p);
    }
    cells.push([headingCell]);
    const subheadingCell = document.createElement("div");
    subheadingCell.appendChild(document.createComment("field:subheading"));
    if (eyebrow && heading) {
      const p = document.createElement("p");
      p.textContent = heading.textContent.trim();
      subheadingCell.appendChild(p);
    } else {
      const desc = element.querySelector("p:not(.eyebrow):not(.label)");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        subheadingCell.appendChild(p);
      }
    }
    cells.push([subheadingCell]);
    const formCell = document.createElement("div");
    formCell.appendChild(document.createComment("field:form"));
    const emailInput = element.querySelector('input[type="email"], input[type="text"]');
    if (emailInput) {
      const emailP = document.createElement("p");
      emailP.textContent = emailInput.placeholder || "Enter your email";
      formCell.appendChild(emailP);
    }
    const select = element.querySelector("select");
    if (select) {
      const options = select.querySelectorAll("option");
      const optionP = document.createElement("p");
      const optionTexts = Array.from(options).map((opt) => opt.textContent.trim()).join(", ");
      optionP.textContent = `Options: ${optionTexts}`;
      formCell.appendChild(optionP);
    }
    cells.push([formCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Form Newsletter",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/firstnet.js
  function transform(hookName, element) {
    if (hookName === "beforeTransform") {
      element.querySelectorAll("script, style, noscript, iframe").forEach((el) => el.remove());
      element.querySelectorAll("[hidden]").forEach((el) => el.remove());
    }
    if (hookName === "afterTransform") {
      let heroBlock = null;
      element.querySelectorAll("div").forEach((div) => {
        if (div.textContent.includes("MISSION-CRITICAL COMMUNICATIONS") || div.textContent.includes("America's first responder network")) {
          if (!heroBlock || div.contains(heroBlock)) {
            heroBlock = div;
          }
        }
      });
      if (!heroBlock) {
        heroBlock = element.querySelector(".hero");
      }
      if (heroBlock) {
        let contentStart = heroBlock;
        while (contentStart.parentElement && contentStart.parentElement !== element) {
          contentStart = contentStart.parentElement;
        }
        const allChildren = Array.from(element.children);
        let foundContent = false;
        allChildren.forEach((child) => {
          if (child === contentStart || child.contains(heroBlock)) {
            foundContent = true;
          }
          if (!foundContent && !child.classList.contains("metadata") && !child.classList.contains("hero")) {
            child.remove();
          }
        });
      }
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.toLowerCase().trim();
        if (text === "menu" || text.includes("search form") || text.includes("search search")) {
          p.remove();
          return;
        }
        if (text.includes("sign up") && text.includes("log in")) {
          p.remove();
          return;
        }
        if (text === "products" || text === "about" || text === "get started" || text === "features" || text === "highlights" || text === "trending" || text.includes("top devices") || text.includes("top offers") || text.includes("customer stories") || text.includes("plans and devices") || text === "enter item label link") {
          p.remove();
          return;
        }
      });
      element.querySelectorAll("ul").forEach((ul) => {
        const links = ul.querySelectorAll("a");
        if (links.length >= 2) {
          const navPatterns = [
            "individual plans",
            "agency plans",
            "international plans",
            "cell boosters",
            "phones",
            "connected devices",
            "tablets",
            "featured apps",
            "app catalog",
            "firstnet fusion",
            "firstnet rapid response",
            "firstnet and family",
            "what is firstnet",
            "newsroom",
            "events",
            "health and wellness",
            "firstnet promise",
            "enhanced solutions",
            "response operations",
            "healthcare",
            "law enforcement",
            "fire and rescue",
            "utilities",
            "ems",
            "fleet management",
            "school safety",
            "complete profile",
            "complete verification",
            "agency sign up",
            "how to pay bill",
            "shop hot spot",
            "international day pass",
            "migrate your account",
            "activate esim"
          ];
          const linkTexts = Array.from(links).map((l) => l.textContent.toLowerCase());
          const navCount = linkTexts.filter((t) => navPatterns.some((p) => t.includes(p))).length;
          if (navCount >= 1) {
            ul.remove();
          }
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const img = p.querySelector('img[src*="icon"], img[src*="functional-icon"]');
        const link = p.querySelector("a");
        if (img && link) {
          const text = link.textContent.toLowerCase();
          const navLinkPatterns = [
            "rate plans",
            "coverage",
            "firstnet devices",
            "mission-critical",
            "offers",
            "firstnet apps",
            "who's eligible",
            "contact us",
            "industry solutions"
          ];
          if (navLinkPatterns.some((p2) => text.includes(p2))) {
            p.remove();
          }
        }
      });
      const footerSelectors = [
        ".firstnet-footer-container-mp",
        ".footer-column",
        ".footer-heading",
        ".footer-links",
        ".cookie-disclaimer-component",
        ".gatingContainer",
        ".gating-inner",
        '[class*="footer"]',
        ".follow-us-desktop",
        ".uws-badge__wrapper",
        ".nuance-chat-floating-container",
        ".att-modal-container"
      ];
      footerSelectors.forEach((sel) => {
        element.querySelectorAll(sel).forEach((el) => el.remove());
      });
      element.querySelectorAll('a[href*="facebook.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="youtube.com"]').forEach((link) => {
        const parent = link.closest("div, p");
        if (parent) parent.remove();
      });
      element.querySelectorAll('a[href*="privacy"], a[href*="terms"], a[href*="accessibility"], a[href*="cyberaware"]').forEach((link) => {
        const parent = link.closest("p, div.parsys");
        if (parent && parent.textContent.trim().length < 100) parent.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim().toLowerCase();
        if (text === "sitemap" || text === "support" || text === "follow us") {
          p.remove();
          return;
        }
        if (text.includes("privacy notice") || text.includes("terms & conditions") || text.includes("accessibility")) {
          p.remove();
          return;
        }
        if (text.includes("\xA9 ") || text.includes("all rights reserved")) {
          p.remove();
          return;
        }
        if (text.includes("firstnet.gov") || text.includes("cyber security") || text.includes("health privacy")) {
          p.remove();
          return;
        }
        const gatedPatterns = ["gated form", "first name", "last name", "company", "company name", "title", "title name", "city", "state", "zip code", "email", "email address"];
        if (gatedPatterns.some((pat) => text === pat)) {
          p.remove();
          return;
        }
        if (text.includes("by submitting this form, i agree")) {
          p.remove();
          return;
        }
        if (text === "i accept" || text === "\xD7" || text === "feedback") {
          p.remove();
          return;
        }
      });
      element.querySelectorAll("ul").forEach((ul) => {
        const links = ul.querySelectorAll("a");
        const linkTexts = Array.from(links).map((l) => l.textContent.toLowerCase());
        const footerPatterns = ["power of firstnet", "rate plans", "devices", "industry solutions", "application ecosystem", "community", "coverage"];
        const isFooterList = footerPatterns.some((pat) => linkTexts.some((t) => t.includes(pat)));
        if (isFooterList && links.length >= 5) {
          ul.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const socialLink = p.querySelector('a[href*="facebook.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="youtube.com"]');
        if (socialLink) {
          p.remove();
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing") || src.includes("rlcdn") || src.includes("verint") || src.includes("facebook.com/tr") || src.includes("pixel")) {
          const parent = img.parentElement;
          if (parent && parent.tagName === "P") {
            parent.remove();
          } else {
            img.remove();
          }
        }
      });
      element.querySelectorAll("h3, h4").forEach((h) => {
        const text = h.textContent.toLowerCase();
        if (text.includes("video title") || text.includes("gated form") || text.includes("we use cookies")) {
          h.remove();
        }
      });
      element.querySelectorAll("p, div, ul, ol").forEach((el) => {
        if (!el.textContent.trim() && !el.querySelector("img, picture, video, table")) {
          el.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const img = p.querySelector('img[alt*="FirstNet logo"], img[alt*="firstnet_logo"]');
        if (img && p.textContent.trim().length < 10) {
          p.remove();
        }
      });
    }
  }

  // tools/importer/transformers/sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const whyFirstNetH2 = Array.from(element.querySelectorAll("h2")).find(
      (h2) => h2.textContent.trim() === "Why FirstNet for 5G public safety"
    );
    const latestNewsH3 = Array.from(element.querySelectorAll("h3")).find(
      (h3) => h3.textContent.includes("Latest news from public safety")
    );
    if (whyFirstNetH2 && latestNewsH3) {
      const darkSectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: [
          [createTextDiv(document, "Style"), createTextDiv(document, "dark")]
        ]
      });
      const hrBeforeDark = document.createElement("hr");
      whyFirstNetH2.parentElement.insertBefore(hrBeforeDark, whyFirstNetH2);
      const hrAfterDark = document.createElement("hr");
      latestNewsH3.parentElement.insertBefore(darkSectionMetadata, latestNewsH3);
      latestNewsH3.parentElement.insertBefore(hrAfterDark, latestNewsH3);
    }
    let connectElement = null;
    const allH3s = element.querySelectorAll("h3");
    console.log("[sections] Found", allH3s.length, "H3 elements");
    for (const h3 of allH3s) {
      if (h3.textContent.includes("Connect with a FirstNet specialist")) {
        connectElement = h3;
        console.log("[sections] Found connect H3");
        break;
      }
    }
    let formNewsletter = null;
    const allTables = element.querySelectorAll("table");
    console.log("[sections] Found", allTables.length, "tables");
    for (const table of allTables) {
      const header = table.querySelector("th");
      if (header && header.textContent.includes("Form Newsletter")) {
        formNewsletter = table;
        console.log("[sections] Found form-newsletter table via header");
        break;
      }
    }
    if (!formNewsletter) {
      formNewsletter = element.querySelector(".form-newsletter, table.form-newsletter");
      console.log("[sections] Form newsletter found by class:", !!formNewsletter);
    }
    if (connectElement && formNewsletter) {
      console.log("[sections] Both elements found, inserting gray section markers");
      const graySectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: [
          [createTextDiv(document, "Style"), createTextDiv(document, "gray")]
        ]
      });
      const hrBeforeContact = document.createElement("hr");
      connectElement.parentElement.insertBefore(hrBeforeContact, connectElement);
      const hrAfterContact = document.createElement("hr");
      formNewsletter.parentElement.insertBefore(graySectionMetadata, formNewsletter);
      formNewsletter.parentElement.insertBefore(hrAfterContact, formNewsletter);
    }
  }
  function createTextDiv(document, text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "headband": parse,
    "hero": parse2,
    "cards-offer": parse3,
    "columns-icons": parse4,
    "cards-news": parse5,
    "form-newsletter": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "FirstNet homepage with hero, features, and promotional content sections",
    urls: [
      "https://www.firstnet.com/"
    ],
    blocks: [
      {
        name: "headband",
        instances: [".headband"]
      },
      {
        name: "hero",
        instances: [".marquee-heading"]
      },
      {
        name: "cards-offer",
        instances: [".new-offers-card .offersCard"]
      },
      {
        name: "columns-icons",
        instances: [".icon-grid"]
      },
      {
        name: "cards-news",
        instances: [".new-offers-card .offersCard"]
      },
      {
        name: "form-newsletter",
        instances: [".email-signup"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    /**
     * Main transformation function
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
