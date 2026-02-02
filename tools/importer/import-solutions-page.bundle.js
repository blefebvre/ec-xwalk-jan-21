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

  // tools/importer/parsers/hero-solutions.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1") || element.querySelector("h2") || element.querySelector(".mega-left-clm h1");
    const description = element.querySelector(".mega-left-clm p") || element.querySelector("p");
    const heroImage = element.querySelector(".mega-left-clm img") || element.querySelector("img");
    const cells = [];
    if (heroImage) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(heroImage.cloneNode(true));
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading.cloneNode(true));
    if (description) textCell.appendChild(description.cloneNode(true));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse2(element, { document }) {
    const paragraphs = Array.from(element.querySelectorAll("p"));
    const link = element.querySelector("a");
    const cells = [];
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (paragraphs.length > 0) {
      const eyebrow = document.createElement("p");
      eyebrow.innerHTML = `<strong>${paragraphs[0].textContent}</strong>`;
      textCell.appendChild(eyebrow);
    }
    if (paragraphs.length > 1) {
      textCell.appendChild(paragraphs[1].cloneNode(true));
    }
    if (link) {
      const linkP = document.createElement("p");
      linkP.appendChild(link.cloneNode(true));
      textCell.appendChild(linkP);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-features.js
  function parse3(element, { document }) {
    const cells = [];
    const row = element.querySelector(".row, .component-columns");
    if (row) {
      const cols = row.querySelectorAll('[class*="col-md"], [class*="col-lg"], .col');
      if (cols.length > 0) {
        const rowCells = [];
        cols.forEach((col) => {
          const cell = document.createDocumentFragment();
          Array.from(col.childNodes).forEach((child) => {
            if (child.nodeType === 1 || child.nodeType === 3 && child.textContent.trim()) {
              cell.appendChild(child.cloneNode(true));
            }
          });
          rowCells.push(cell);
        });
        cells.push(rowCells);
      } else {
        const cell = document.createDocumentFragment();
        Array.from(row.childNodes).forEach((child) => {
          if (child.nodeType === 1) {
            cell.appendChild(child.cloneNode(true));
          }
        });
        cells.push([cell]);
      }
    } else {
      const cell = document.createDocumentFragment();
      const container = element.querySelector(".container") || element;
      Array.from(container.children).forEach((child) => {
        cell.appendChild(child.cloneNode(true));
      });
      cells.push([cell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-features", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-quotes.js
  function parse4(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll('.carousel-slide, .quote-item, [class*="slide"], .carousel-item');
    const quoteContainers = slides.length > 0 ? slides : element.querySelectorAll('[class*="quote"], [class*="testimonial"]');
    if (quoteContainers.length > 0) {
      quoteContainers.forEach((slide) => {
        const quoteText = slide.querySelector("p, .quote-text, blockquote");
        const attribution = slide.querySelector('[class*="author"], [class*="attribution"], p:last-child');
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:content_text "));
        if (quoteText) {
          textCell.appendChild(quoteText.cloneNode(true));
        }
        if (attribution && attribution !== quoteText) {
          textCell.appendChild(attribution.cloneNode(true));
        }
        const image = slide.querySelector("img");
        if (image) {
          const imageCell = document.createDocumentFragment();
          imageCell.appendChild(document.createComment(" field:media_image "));
          imageCell.appendChild(image.cloneNode(true));
          cells.push([imageCell, textCell]);
        } else {
          cells.push([textCell]);
        }
      });
    } else {
      const cell = document.createDocumentFragment();
      cell.appendChild(document.createComment(" field:content_text "));
      Array.from(element.children).forEach((child) => {
        cell.appendChild(child.cloneNode(true));
      });
      cells.push([cell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-quotes", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resources.js
  function parse5(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll('.card, .resource-card, [class*="card-item"], [class*="video-card"], [class*="related-card"]');
    const cardItems = cards.length > 0 ? cards : element.querySelectorAll('.row > div, .grid > div, [class*="col-"]');
    if (cardItems.length > 0) {
      cardItems.forEach((card) => {
        const image = card.querySelector("img");
        const title = card.querySelector('h2, h3, h4, .card-title, [class*="title"]');
        const description = card.querySelector('p, .card-description, [class*="description"]');
        const link = card.querySelector("a");
        const category = card.querySelector('[class*="category"], [class*="type"], .eyebrow');
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:text "));
        if (category) {
          const categoryP = document.createElement("p");
          categoryP.innerHTML = `<strong>${category.textContent}</strong>`;
          textCell.appendChild(categoryP);
        }
        if (title) textCell.appendChild(title.cloneNode(true));
        if (description) textCell.appendChild(description.cloneNode(true));
        if (link) {
          const linkP = document.createElement("p");
          linkP.appendChild(link.cloneNode(true));
          textCell.appendChild(linkP);
        }
        if (image) {
          const imageCell = document.createDocumentFragment();
          imageCell.appendChild(document.createComment(" field:image "));
          imageCell.appendChild(image.cloneNode(true));
          cells.push([imageCell, textCell]);
        } else {
          cells.push([textCell]);
        }
      });
    } else {
      const cell = document.createDocumentFragment();
      cell.appendChild(document.createComment(" field:text "));
      Array.from(element.children).forEach((child) => {
        cell.appendChild(child.cloneNode(true));
      });
      cells.push([cell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll('.accordion-item, [class*="faq-item"], details, .faq-question');
    const faqItems = items.length > 0 ? items : element.querySelectorAll('[class*="question"], [class*="accordion"]');
    if (faqItems.length > 0) {
      faqItems.forEach((item) => {
        const question = item.querySelector('button, summary, [class*="question"], h3, h4');
        const answer = item.querySelector('p, [class*="answer"], [class*="content"], .accordion-content');
        if (question || answer) {
          const summaryCell = document.createDocumentFragment();
          summaryCell.appendChild(document.createComment(" field:summary "));
          if (question) {
            const questionText = question.textContent.replace(/[+\-]/g, "").trim();
            const questionP = document.createElement("p");
            questionP.textContent = questionText;
            summaryCell.appendChild(questionP);
          }
          const textCell = document.createDocumentFragment();
          textCell.appendChild(document.createComment(" field:text "));
          if (answer) {
            textCell.appendChild(answer.cloneNode(true));
          }
          cells.push([summaryCell, textCell]);
        }
      });
    } else {
      const cell = document.createDocumentFragment();
      cell.appendChild(document.createComment(" field:text "));
      Array.from(element.children).forEach((child) => {
        cell.appendChild(child.cloneNode(true));
      });
      cells.push([cell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/gigamon-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "meta",
        "link",
        "noscript"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "header",
        "nav",
        ".header",
        ".site-header",
        ".nav-wrapper",
        ".navigation",
        ".mega-menu",
        ".mega-menu-wrapper",
        ".main-nav",
        ".mobile-nav",
        ".mobile-menu",
        ".hamburger",
        ".search-overlay",
        ".search-modal",
        '[role="navigation"]',
        '[role="banner"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        ".footer",
        ".site-footer",
        ".footer-wrapper",
        ".footer-nav",
        ".footer-links",
        ".footer-bottom",
        '[role="contentinfo"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".onetrust-consent-sdk",
        ".onetrust-pc-dark-filter",
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".cookie-consent",
        ".cookie-banner",
        ".privacy-banner",
        ".gdpr-banner",
        '[id*="onetrust"]',
        '[class*="onetrust"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".social-share",
        ".social-links",
        ".language-selector",
        ".lang-selector",
        ".share-buttons"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".modal",
        ".overlay",
        ".popup",
        ".lightbox",
        '[role="dialog"]'
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.setAttribute("style", "overflow: scroll;");
      }
    }
    if (hookName === TransformHook.afterTransform) {
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("onmouseover");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
      });
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "source",
        'svg[aria-hidden="true"]'
      ]);
    }
  }

  // tools/importer/import-solutions-page.js
  var parsers = {
    "hero-solutions": parse,
    "cards-promo": parse2,
    "columns-features": parse3,
    "carousel-quotes": parse4,
    "cards-resources": parse5,
    "accordion-faq": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "solutions-page",
    description: "Solutions page showcasing Gigamon cloud migration capabilities and benefits",
    urls: [
      "https://www.gigamon.com/solutions/accelerate-cloud-migration.html"
    ],
    blocks: [
      {
        name: "hero-solutions",
        instances: [".mega-banner"]
      },
      {
        name: "cards-promo",
        instances: [".columns .promo-card", ".promo"]
      },
      {
        name: "columns-features",
        instances: [".site-content > .columns"]
      },
      {
        name: "carousel-quotes",
        instances: [".carousel"]
      },
      {
        name: "cards-resources",
        instances: [".responsive-layout"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-accordion"]
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
     * Uses the 'one input / multiple outputs' pattern with transform() method
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
