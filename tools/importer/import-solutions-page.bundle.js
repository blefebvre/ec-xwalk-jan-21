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

  // tools/importer/import-solutions-page.js
  var import_solutions_page_exports = {};
  __export(import_solutions_page_exports, {
    default: () => import_solutions_page_default
  });

  // tools/importer/parsers/hero-dark.js
  function parse(element, { document }) {
    let heroImage = element.querySelector("img:not(.marginline)");
    let backgroundImageUrl = null;
    if (!heroImage) {
      const computedStyle = window.getComputedStyle(element);
      const bgImage = computedStyle.backgroundImage;
      if (bgImage && bgImage !== "none") {
        const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          backgroundImageUrl = urlMatch[1];
        }
      }
    }
    const contentArea = element.querySelector(".mega-content, .mega-left-clm");
    const imageCell = document.createElement("div");
    if (heroImage) {
      imageCell.appendChild(document.createComment(" field:image "));
      const imgClone = heroImage.cloneNode(true);
      if (!imgClone.alt) {
        imgClone.alt = "Hero background image";
      }
      imageCell.appendChild(imgClone);
    } else if (backgroundImageUrl) {
      imageCell.appendChild(document.createComment(" field:image "));
      const img = document.createElement("img");
      img.src = backgroundImageUrl;
      img.alt = "Hero background image";
      imageCell.appendChild(img);
    }
    const textCell = document.createElement("div");
    if (contentArea) {
      textCell.appendChild(document.createComment(" field:text "));
      const heading = contentArea.querySelector("h1, h2, .component-text h1, .component-text h2");
      if (heading) {
        const h1 = document.createElement("h1");
        h1.textContent = heading.textContent.trim();
        textCell.appendChild(h1);
      }
      const paragraphs = contentArea.querySelectorAll(".component-text p");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          const pClone = document.createElement("p");
          pClone.textContent = p.textContent.trim();
          textCell.appendChild(pClone);
        }
      });
      const buttons = contentArea.querySelectorAll(".component-cta-button a, .btn");
      buttons.forEach((btn) => {
        const link = document.createElement("a");
        link.href = btn.href || "#";
        link.textContent = btn.textContent.trim();
        textCell.appendChild(link);
        textCell.appendChild(document.createElement("br"));
      });
    }
    const cells = [];
    if (imageCell.hasChildNodes()) {
      cells.push([imageCell]);
    }
    if (textCell.hasChildNodes()) {
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Hero Dark",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gigamon.js
  function parse2(element, { document }) {
    const cells = [];
    if (element.classList.contains("resource-card")) {
      const cardImage = element.querySelector(".resource-card-image img, .component-image img");
      const cardContent = element.querySelector(".component-resource-card, .component-text");
      const row = [];
      if (cardImage) {
        row.push(cardImage.cloneNode(true));
      } else {
        row.push("");
      }
      const textDiv = document.createElement("div");
      const fieldHint = document.createComment(" field:text ");
      textDiv.appendChild(fieldHint);
      if (cardContent) {
        const heading = cardContent.querySelector("h2, h3, .super-title");
        if (heading && heading.textContent.trim()) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          textDiv.appendChild(h3);
        }
        const desc = cardContent.querySelector(".component-text p, p");
        if (desc && desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textDiv.appendChild(p);
        }
        const link = cardContent.querySelector("a");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || "#";
          a.textContent = link.textContent.trim() || "Read More";
          textDiv.appendChild(a);
        }
      }
      row.push(textDiv);
      cells.push(row);
    }
    if (element.classList.contains("promo-container") || element.classList.contains("related-pages") || element.classList.contains("component-related-pages")) {
      const cards = element.querySelectorAll(".resource-card, .promo-item, .related-page-item");
      cards.forEach((card) => {
        const cardImage = card.querySelector("img");
        const cardTitle = card.querySelector("h2, h3, h4, .title");
        const cardDesc = card.querySelector("p, .description");
        const cardLink = card.querySelector("a");
        const row = [];
        if (cardImage) {
          row.push(cardImage.cloneNode(true));
        } else {
          row.push("");
        }
        const textDiv = document.createElement("div");
        const fieldHint = document.createComment(" field:text ");
        textDiv.appendChild(fieldHint);
        if (cardTitle && cardTitle.textContent.trim()) {
          const h3 = document.createElement("h3");
          h3.textContent = cardTitle.textContent.trim();
          textDiv.appendChild(h3);
        }
        if (cardDesc && cardDesc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = cardDesc.textContent.trim();
          textDiv.appendChild(p);
        }
        if (cardLink) {
          const a = document.createElement("a");
          a.href = cardLink.href || "#";
          a.textContent = cardLink.textContent.trim() || "Learn More";
          textDiv.appendChild(a);
        }
        row.push(textDiv);
        cells.push(row);
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Cards Gigamon",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-gigamon.js
  function parse3(element, { document }) {
    const cells = [];
    const columnSection = element.querySelector(".component-columns") || element;
    const columns = columnSection.querySelectorAll('[class*="col-md-"], [class*="col-xs-"]');
    if (columns.length > 0) {
      const row = [];
      columns.forEach((col) => {
        const colContent = document.createElement("div");
        const headings = col.querySelectorAll("h1, h2, h3, h4");
        headings.forEach((h) => {
          if (h.textContent.trim()) {
            const heading = document.createElement(h.tagName.toLowerCase());
            heading.textContent = h.textContent.trim();
            colContent.appendChild(heading);
          }
        });
        const paragraphs = col.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) {
            const para = document.createElement("p");
            para.textContent = p.textContent.trim();
            colContent.appendChild(para);
          }
        });
        const lists = col.querySelectorAll("ul, ol");
        lists.forEach((list) => {
          const listClone = list.cloneNode(true);
          colContent.appendChild(listClone);
        });
        const images = col.querySelectorAll("img");
        images.forEach((img) => {
          if (img.src) {
            colContent.appendChild(img.cloneNode(true));
          }
        });
        const links = col.querySelectorAll("a.btn, .component-cta-button a");
        links.forEach((link) => {
          if (link.textContent.trim()) {
            const a = document.createElement("a");
            a.href = link.href || "#";
            a.textContent = link.textContent.trim();
            colContent.appendChild(a);
          }
        });
        if (colContent.children.length > 0 || colContent.textContent.trim()) {
          row.push(colContent);
        }
      });
      if (row.length > 0) {
        cells.push(row);
      }
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Columns Gigamon",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/quote-analyst.js
  function parse4(element, { document }) {
    const cells = [];
    const quoteSection = element.querySelector(".component-quotes") || element;
    const quoteDesc = quoteSection.querySelector(".quotes-description");
    const quoteLogo = quoteSection.querySelector(".quotes-left img, .quotes-head img");
    const quoteCta = quoteSection.querySelector(".component-cta-button a, .quotes-right a");
    if (quoteDesc) {
      const quotationDiv = document.createElement("div");
      const fieldHintQuote = document.createComment(" field:quotation ");
      quotationDiv.appendChild(fieldHintQuote);
      const paragraphs = quoteDesc.querySelectorAll("p, .component-text");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          const para = document.createElement("p");
          para.textContent = p.textContent.trim();
          quotationDiv.appendChild(para);
        }
      });
      if (quotationDiv.childNodes.length === 1) {
        const textContent = quoteDesc.textContent.trim();
        if (textContent) {
          const para = document.createElement("p");
          para.textContent = textContent;
          quotationDiv.appendChild(para);
        }
      }
      cells.push([quotationDiv]);
    }
    const attrDiv = document.createElement("div");
    const fieldHintAttr = document.createComment(" field:attribution ");
    attrDiv.appendChild(fieldHintAttr);
    if (quoteLogo) {
      attrDiv.appendChild(quoteLogo.cloneNode(true));
    }
    if (quoteCta) {
      const link = document.createElement("a");
      link.href = quoteCta.href || "#";
      link.textContent = quoteCta.textContent.trim();
      attrDiv.appendChild(link);
    }
    if (attrDiv.childNodes.length > 1) {
      cells.push([attrDiv]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Quote Analyst",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const cells = [];
    const accordionSection = element.querySelector(".component-faq-accordion") || element;
    const heading = accordionSection.querySelector(".text-center h2, .component-text h2");
    const accordionItems = accordionSection.querySelectorAll(".accordion-item");
    if (heading && heading.textContent.trim()) {
      const headingDiv = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      headingDiv.appendChild(h2);
      cells.push([headingDiv]);
    }
    accordionItems.forEach((item) => {
      const questionEl = item.querySelector(".accordion-title, .accordion-header");
      const question = questionEl ? questionEl.textContent.trim() : "";
      const answerEl = item.querySelector(".accordion-content");
      if (question) {
        const summaryDiv = document.createElement("div");
        const fieldHintSummary = document.createComment(" field:summary ");
        summaryDiv.appendChild(fieldHintSummary);
        const questionPara = document.createElement("p");
        questionPara.textContent = question;
        summaryDiv.appendChild(questionPara);
        const answerDiv = document.createElement("div");
        if (answerEl) {
          const answerContent = answerEl.cloneNode(true);
          const paragraphs = answerContent.querySelectorAll("p");
          if (paragraphs.length > 0) {
            paragraphs.forEach((p) => {
              if (p.textContent.trim()) {
                const para = document.createElement("p");
                para.textContent = p.textContent.trim();
                answerDiv.appendChild(para);
              }
            });
          } else {
            const para = document.createElement("p");
            para.textContent = answerContent.textContent.trim();
            answerDiv.appendChild(para);
          }
        }
        cells.push([summaryDiv, answerDiv]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Accordion Faq",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/gigamon-cleanup.js
  function transform(hookName, element) {
    if (hookName === "beforeTransform") {
      const navSelectors = [
        "nav",
        "header",
        ".navigation",
        ".nav-menu",
        ".global-navigation",
        ".component-global-navigation",
        "#mp-menu",
        ".mp-menu",
        ".mp-level",
        ".mp-back",
        ".mobile-closelogo",
        ".mobile-trigger",
        ".mobile-close-nav",
        ".header-nav",
        ".main-nav",
        ".top-nav",
        ".sticky-nav",
        ".sticky-header"
      ];
      element.querySelectorAll(navSelectors.join(", ")).forEach((el) => el.remove());
      const footerSelectors = [
        "footer",
        ".footer",
        ".site-footer",
        ".fat-footer",
        ".component-fat-footer",
        ".footer-container",
        ".footer-links",
        ".footer-nav",
        ".copyright"
      ];
      element.querySelectorAll(footerSelectors.join(", ")).forEach((el) => el.remove());
      const modalSelectors = [
        ".modal",
        ".modal-inner",
        ".modal-content",
        ".modal-close",
        ".general-modal",
        ".component-general-modal",
        ".popup",
        ".overlay",
        ".lightbox",
        '[class*="modal--"]'
      ];
      element.querySelectorAll(modalSelectors.join(", ")).forEach((el) => el.remove());
      const cookieSelectors = [
        ".cookie-banner",
        ".cookie-consent",
        ".cookie-notice",
        ".gdpr-banner",
        ".privacy-banner",
        "#onetrust-consent-sdk",
        "#cookieConsent",
        '[class*="cookie"]',
        '[id*="cookie"]'
      ];
      element.querySelectorAll(cookieSelectors.join(", ")).forEach((el) => el.remove());
      const socialSelectors = [
        ".social-share",
        ".share-buttons",
        ".addthis",
        ".social-links",
        ".social-icons",
        ".share-widget",
        '[class*="share-"]',
        '[class*="social-"]'
      ];
      element.querySelectorAll(socialSelectors.join(", ")).forEach((el) => el.remove());
      const formSelectors = [
        ".newsletter-signup",
        ".subscribe-form",
        ".email-signup",
        ".contact-form",
        ".marketo-form",
        '[class*="newsletter"]',
        '[class*="subscribe"]'
      ];
      element.querySelectorAll(formSelectors.join(", ")).forEach((el) => el.remove());
      const chatSelectors = [
        ".chat-widget",
        ".live-chat",
        ".support-chat",
        "#drift-widget",
        "#intercom-container",
        '[class*="chat-"]'
      ];
      element.querySelectorAll(chatSelectors.join(", ")).forEach((el) => el.remove());
      const aemSelectors = [
        ".aem-Grid:empty",
        ".aem-GridColumn:empty",
        ".par:empty",
        ".iparys_inherited:empty",
        ".newpar",
        ".new.section:empty",
        ".parsys:empty",
        ".cq-placeholder",
        "[data-sly-test]",
        "[data-sly-use]",
        "[data-sly-resource]",
        "[data-cmp-is]",
        ".experiencefragment"
      ];
      element.querySelectorAll(aemSelectors.join(", ")).forEach((el) => el.remove());
      element.querySelectorAll("link").forEach((el) => el.remove());
      element.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
      const searchSelectors = [
        ".search",
        ".search-form",
        ".search-results",
        ".search-overlay",
        ".site-search",
        '[class*="search-"]',
        '[id*="search"]'
      ];
      element.querySelectorAll(searchSelectors.join(", ")).forEach((el) => el.remove());
      const breadcrumbSelectors = [
        ".breadcrumb",
        ".breadcrumbs",
        ".component-breadcrumb",
        '[class*="breadcrumb"]'
      ];
      element.querySelectorAll(breadcrumbSelectors.join(", ")).forEach((el) => el.remove());
      const loginSelectors = [
        ".login-links",
        ".login-menu",
        ".login-dropdown",
        "#login-opt",
        '[class*="login"]',
        '[id*="login"]',
        ".account-menu",
        ".user-menu",
        ".signin",
        ".sign-in",
        '[href*="/login"]',
        '[href*="/signin"]',
        ".sprite-mobile-login"
      ];
      element.querySelectorAll(loginSelectors.join(", ")).forEach((el) => el.remove());
      const languageSelectors = [
        ".lang-container",
        ".lang-options",
        ".lang-links",
        "#lang-opt",
        ".language-picker",
        ".language-selector",
        ".locale-selector",
        ".country-selector",
        ".region-selector",
        '[class*="lang-"]',
        ".sprite-mobile-language"
      ];
      element.querySelectorAll(languageSelectors.join(", ")).forEach((el) => el.remove());
      const utilityMenuSelectors = [
        ".utility-item",
        ".utility-submenu",
        ".utility-menu",
        ".utility-bar",
        ".nav-container.lang-container"
      ];
      element.querySelectorAll(utilityMenuSelectors.join(", ")).forEach((el) => el.remove());
      const utilitySelectors = [
        ".back-to-top",
        ".scroll-to-top",
        ".skip-link",
        ".skip-nav",
        ".utility-nav",
        ".toolbar",
        ".sticky-cta"
      ];
      element.querySelectorAll(utilitySelectors.join(", ")).forEach((el) => el.remove());
      element.querySelectorAll(".image:empty, .component-image:empty").forEach((el) => el.remove());
      element.querySelectorAll('[class*="vert-pad"]').forEach((el) => {
        const classes = el.className.split(" ").filter((c) => !c.startsWith("vert-pad"));
        if (classes.length > 0) {
          el.className = classes.join(" ");
        } else {
          el.removeAttribute("class");
        }
      });
      element.querySelectorAll('[aria-hidden="true"], .hidden, .visually-hidden, .sr-only').forEach((el) => {
        if (!el.classList.contains("sr-only") || !el.textContent.trim()) {
          el.remove();
        }
      });
      element.querySelectorAll('img[src^="data:image/svg"]').forEach((img) => {
        const width = img.getAttribute("width");
        const height = img.getAttribute("height");
        if (width && parseInt(width, 10) <= 20 || height && parseInt(height, 10) <= 20) {
          img.remove();
        }
      });
    }
    if (hookName === "afterTransform") {
      for (let i = 0; i < 3; i += 1) {
        element.querySelectorAll("div, section, span, p, article, aside").forEach((el) => {
          if (!el.textContent.trim() && el.children.length === 0 && !el.closest(".block")) {
            el.remove();
          }
        });
      }
      const seenSrcs = /* @__PURE__ */ new Set();
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && seenSrcs.has(src)) {
          if (!img.closest(".block")) {
            img.remove();
          }
        } else if (src) {
          seenSrcs.add(src);
        }
      });
      element.querySelectorAll(".site-wrapper").forEach((wrapper) => {
        if (!wrapper.querySelector(".block") && !wrapper.textContent.trim()) {
          wrapper.remove();
        }
      });
      element.querySelectorAll("[data-analytics], [data-tracking], [data-gtm]").forEach((el) => {
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-tracking");
        el.removeAttribute("data-gtm");
      });
    }
  }

  // tools/importer/import-solutions-page.js
  var parsers = {
    "hero-dark": parse,
    "cards-gigamon": parse2,
    "columns-gigamon": parse3,
    "quote-analyst": parse4,
    "accordion-faq": parse5
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "solutions-page",
    description: "Solutions page promoting Gigamon cloud migration acceleration capabilities",
    urls: [
      "https://www.gigamon.com/solutions/accelerate-cloud-migration.html"
    ],
    blocks: [
      {
        name: "hero-dark",
        instances: [".component-mega-banner"]
      },
      {
        name: "cards-gigamon",
        instances: [".resource-card", ".promo-container", ".related-pages", ".component-related-pages"]
      },
      {
        name: "columns-gigamon",
        instances: [".component-columns"]
      },
      {
        name: "quote-analyst",
        instances: [".quotes", ".component-quotes"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-accordion", ".component-faq-accordion"]
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
  var import_solutions_page_default = {
    /**
     * Main transformation function
     * Uses the 'one input / multiple outputs' transform() pattern
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_solutions_page_exports);
})();
