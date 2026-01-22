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

  // tools/importer/parsers/columns-hero-images.js
  function parse(element, { document }) {
    const imageDivs = element.querySelectorAll(".utility-aspect-1x1");
    const cells = [];
    if (imageDivs.length >= 2) {
      const col1 = [];
      const col2 = [];
      const img1 = imageDivs[0].querySelector("img");
      const img2 = imageDivs[1].querySelector("img");
      if (img1) col1.push(img1.cloneNode(true));
      if (img2) col2.push(img2.cloneNode(true));
      cells.push([col1, col2]);
    } else {
      const images = Array.from(element.querySelectorAll("img"));
      if (images.length >= 2) {
        cells.push([[images[0].cloneNode(true)], [images[1].cloneNode(true)]]);
      } else if (images.length === 1) {
        cells.push([[images[0].cloneNode(true)], []]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-hero-images", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-features.js
  function parse2(element, { document }) {
    const featureItems = element.querySelectorAll(".flex-horizontal.flex-gap-xxs");
    const cells = [];
    featureItems.forEach((item) => {
      const textP = item.querySelector("p");
      const imageCell = [];
      const svg = item.querySelector("svg");
      const img = item.querySelector(".icon img") || item.querySelector("img");
      if (svg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const base64 = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${base64}`;
        const imgEl = document.createElement("img");
        imgEl.src = dataUrl;
        imgEl.alt = "feature icon";
        imageCell.push(document.createComment(" field:image "));
        imageCell.push(imgEl);
      } else if (img) {
        imageCell.push(document.createComment(" field:image "));
        imageCell.push(img.cloneNode(true));
      }
      const textCell = [];
      if (textP) {
        textCell.push(document.createComment(" field:text "));
        textCell.push(textP.cloneNode(true));
      }
      if (textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-features", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse3(element, { document }) {
    const articleLinks = element.querySelectorAll("a.utility-link-content-block");
    const cells = [];
    articleLinks.forEach((articleLink) => {
      const img = articleLink.querySelector("img");
      const tagDiv = articleLink.querySelector(".tag");
      const tagText = tagDiv ? tagDiv.textContent.trim() : "";
      const readTimeDiv = articleLink.querySelector(".paragraph-sm");
      const readTime = readTimeDiv ? readTimeDiv.textContent.trim() : "";
      const heading = articleLink.querySelector("h3, .h4-heading");
      const description = articleLink.querySelector("p");
      const imageCol = [];
      if (img) {
        imageCol.push(document.createComment(" field:image "));
        imageCol.push(img.cloneNode(true));
      }
      const contentCol = [];
      contentCol.push(document.createComment(" field:text "));
      if (tagText) {
        const tagEl = document.createElement("div");
        tagEl.textContent = tagText;
        contentCol.push(tagEl);
      }
      if (readTime) {
        const timeEl = document.createElement("div");
        timeEl.textContent = readTime;
        contentCol.push(timeEl);
      }
      if (heading) {
        contentCol.push(heading.cloneNode(true));
      }
      if (description) {
        contentCol.push(description.cloneNode(true));
      }
      const href = articleLink.getAttribute("href");
      if (href) {
        const readLink = document.createElement("a");
        readLink.href = href;
        readLink.textContent = "Read";
        contentCol.push(readLink);
      }
      if (imageCol.length > 0 || contentCol.length > 0) {
        cells.push([imageCol, contentCol]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-showcase.js
  function parse4(element, { document }) {
    const tabMenuItems = element.querySelectorAll(".w-tab-menu [data-w-tab]");
    const tabPanes = element.querySelectorAll(".w-tab-content .w-tab-pane");
    const cells = [];
    tabMenuItems.forEach((tabItem, index) => {
      const titleDiv = tabItem.querySelector("div");
      const tabTitle = titleDiv ? titleDiv.textContent.trim() : `Tab ${index + 1}`;
      const tabId = tabItem.getAttribute("data-w-tab");
      const matchingPane = element.querySelector(`.w-tab-pane[data-w-tab="${tabId}"]`);
      const titleCol = [];
      titleCol.push(document.createComment(" field:title "));
      const titleEl = document.createElement("p");
      titleEl.textContent = tabTitle;
      titleCol.push(titleEl);
      const contentCol = [];
      if (matchingPane) {
        const heading = matchingPane.querySelector("h3, h2, .h2-heading");
        if (heading) {
          contentCol.push(document.createComment(" field:content_heading "));
          contentCol.push(heading.cloneNode(true));
        }
        const img = matchingPane.querySelector("img");
        if (img) {
          contentCol.push(document.createComment(" field:content_image "));
          contentCol.push(img.cloneNode(true));
        }
      }
      if (titleCol.length > 0) {
        cells.push([titleCol, contentCol]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const accordionItems = element.querySelectorAll(".accordion.w-dropdown, .w-dropdown");
    const cells = [];
    accordionItems.forEach((item) => {
      const toggle = item.querySelector(".w-dropdown-toggle");
      const questionDiv = toggle ? toggle.querySelector(".paragraph-lg") : null;
      const questionText = questionDiv ? questionDiv.textContent.trim() : "";
      const content = item.querySelector(".accordion-content, .w-dropdown-list");
      const answerDiv = content ? content.querySelector(".rich-text, p") : null;
      const questionCol = [];
      if (questionText) {
        questionCol.push(document.createComment(" field:summary "));
        const qEl = document.createElement("p");
        qEl.textContent = questionText;
        questionCol.push(qEl);
      }
      const answerCol = [];
      if (answerDiv) {
        answerCol.push(document.createComment(" field:text "));
        const answerP = answerDiv.querySelector("p") || answerDiv;
        if (answerP) {
          answerCol.push(answerP.cloneNode(true));
        }
      }
      if (questionCol.length > 0) {
        cells.push([questionCol, answerCol]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse6(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const colContent = [];
      const heading = col.querySelector("h2");
      if (heading) {
        colContent.push(heading.cloneNode(true));
      }
      const description = col.querySelector("p.subheading, p");
      if (description) {
        colContent.push(description.cloneNode(true));
      }
      const buttons = col.querySelectorAll("a.button, a.w-button");
      buttons.forEach((btn) => {
        const link = document.createElement("a");
        link.href = btn.getAttribute("href") || "#";
        link.textContent = btn.textContent.trim();
        colContent.push(link);
      });
      if (colContent.length > 0) {
        row.push(colContent);
      }
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".nav.secondary-nav",
        ".nav-container",
        '[role="banner"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        ".inverse-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".nav-mobile-menu-button",
        ".w-nav-button"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("data-wf-domain");
        el.removeAttribute("data-wf-page");
        el.removeAttribute("data-wf-site");
        el.removeAttribute("data-w-tab");
        el.removeAttribute("data-duration");
        el.removeAttribute("data-animation");
        el.removeAttribute("data-easing");
        el.removeAttribute("data-easing2");
        el.removeAttribute("data-collapse");
        el.removeAttribute("data-no-scroll");
        el.removeAttribute("data-delay");
        el.removeAttribute("data-hover");
        el.removeAttribute("data-current");
        el.removeAttribute("aria-current");
      });
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-hero-images": parse,
    "cards-features": parse2,
    "cards-articles": parse3,
    "tabs-showcase": parse4,
    "accordion-faq": parse5,
    "columns-cta": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage with hero and featured content",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero-images",
        instances: ["header .w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md"]
      },
      {
        name: "cards-features",
        instances: [".section:not(.secondary-section):not(.inverse-section) .grid-layout.desktop-4-column.tablet-3-column"]
      },
      {
        name: "section-style-stories",
        instances: ["section.secondary-section:nth-of-type(1)"],
        section: "highlight"
      },
      {
        name: "cards-articles",
        instances: [".secondary-section .grid-layout.tablet-1-column.grid-gap-md"]
      },
      {
        name: "section-tabs",
        instances: ["section.inverse-section"],
        section: "dark"
      },
      {
        name: "tabs-showcase",
        instances: [".w-tabs"]
      },
      {
        name: "section-faq",
        instances: ["section.secondary-section:nth-of-type(2)"],
        section: "highlight"
      },
      {
        name: "accordion-faq",
        instances: [".small-container .flex-vertical"]
      },
      {
        name: "columns-cta",
        instances: ["section:not(.secondary-section):not(.inverse-section):last-of-type .grid-layout.desktop-4-column.y-center"]
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
  function addSectionMetadata(document, sectionElement, style) {
    const cells = [
      ["Section Metadata"],
      ["style", style]
    ];
    const metadataBlock = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: cells.slice(1).map((row) => row.map((cell) => {
        const el = document.createElement("span");
        el.textContent = cell;
        return el;
      }))
    });
    sectionElement.appendChild(metadataBlock);
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
      const parsedBlocks = [];
      pageBlocks.forEach((block) => {
        if (block.name.startsWith("section-") && block.section) {
          addSectionMetadata(document, block.element, block.section);
          parsedBlocks.push(block.name);
          return;
        }
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
            parsedBlocks.push(block.name);
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
          blocks: parsedBlocks
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
