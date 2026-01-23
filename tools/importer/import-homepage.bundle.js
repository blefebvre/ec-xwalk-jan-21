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

  // tools/importer/parsers/columns-image-pair.js
  function parse(element, { document }) {
    const cells = [];
    const imageContainers = element.querySelectorAll(".utility-aspect-1x1");
    if (imageContainers.length === 0) {
      const images = element.querySelectorAll("img");
      if (images.length >= 2) {
        const row = [];
        images.forEach((img, index) => {
          if (index < 2) {
            const cell = document.createElement("div");
            cell.insertAdjacentHTML("afterbegin", "<!-- field:image -->");
            const picture = document.createElement("picture");
            const imgClone = img.cloneNode(true);
            picture.appendChild(imgClone);
            cell.appendChild(picture);
            row.push(cell);
          }
        });
        cells.push(row);
      }
    } else {
      const row = [];
      imageContainers.forEach((container) => {
        const img = container.querySelector("img");
        if (img) {
          const cell = document.createElement("div");
          cell.insertAdjacentHTML("afterbegin", "<!-- field:image -->");
          const picture = document.createElement("picture");
          const imgClone = img.cloneNode(true);
          picture.appendChild(imgClone);
          cell.appendChild(picture);
          row.push(cell);
        }
      });
      if (row.length > 0) {
        cells.push(row);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-image-pair",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon-features.js
  function parse2(element, { document }) {
    const cells = [];
    const featureItems = element.querySelectorAll(".flex-horizontal");
    featureItems.forEach((item) => {
      const iconContainer = item.querySelector(".icon");
      const svg = iconContainer ? iconContainer.querySelector("svg") : null;
      const textElement = item.querySelector("p");
      const text = textElement ? textElement.textContent.trim() : "";
      if (text) {
        const iconCell = document.createElement("div");
        iconCell.insertAdjacentHTML("afterbegin", "<!-- field:image -->");
        if (svg) {
          const iconP = document.createElement("p");
          const iconImg = document.createElement("img");
          const svgClone = svg.cloneNode(true);
          svgClone.setAttribute("width", "24");
          svgClone.setAttribute("height", "24");
          const svgData = new XMLSerializer().serializeToString(svgClone);
          iconImg.src = "data:image/svg+xml;base64," + btoa(svgData);
          iconImg.alt = "feature icon";
          iconP.appendChild(iconImg);
          iconCell.appendChild(iconP);
        }
        const textCell = document.createElement("div");
        textCell.insertAdjacentHTML("afterbegin", "<!-- field:text -->");
        const p = document.createElement("p");
        p.textContent = text;
        textCell.appendChild(p);
        cells.push([iconCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-icon-features",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse3(element, { document }) {
    const cells = [];
    let articleCards = element.querySelectorAll("a.utility-link-content-block");
    if (articleCards.length === 0) {
      articleCards = element.querySelectorAll("a.w-inline-block");
    }
    if (articleCards.length === 0) {
      articleCards = element.querySelectorAll("a");
    }
    articleCards.forEach((card) => {
      const img = card.querySelector("img");
      const tagElement = card.querySelector(".tag div, .tag");
      const tag = tagElement ? tagElement.textContent.trim() : "";
      const readingTimeElement = card.querySelector(".paragraph-sm");
      const readingTime = readingTimeElement ? readingTimeElement.textContent.trim() : "";
      const headingElement = card.querySelector("h3, h4");
      const heading = headingElement ? headingElement.textContent.trim() : "";
      const paragraphs = card.querySelectorAll("p");
      let description = "";
      paragraphs.forEach((p) => {
        if (!p.classList.contains("paragraph-sm") && p.textContent.trim()) {
          description = p.textContent.trim();
        }
      });
      const href = card.getAttribute("href") || "#";
      if (!heading && !description) return;
      const imageCell = document.createElement("div");
      imageCell.insertAdjacentHTML("afterbegin", "<!-- field:image -->");
      if (img) {
        const picture = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        picture.appendChild(imgClone);
        imageCell.appendChild(picture);
      }
      const textCell = document.createElement("div");
      if (tag || readingTime) {
        const metaP = document.createElement("p");
        if (tag) {
          const tagSpan = document.createElement("strong");
          tagSpan.textContent = tag;
          metaP.appendChild(tagSpan);
        }
        if (readingTime) {
          if (tag) metaP.appendChild(document.createTextNode(" \xB7 "));
          metaP.appendChild(document.createTextNode(readingTime));
        }
        textCell.appendChild(metaP);
      }
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading;
        textCell.appendChild(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description;
        textCell.appendChild(p);
      }
      const link = document.createElement("p");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = "Read";
      link.appendChild(a);
      textCell.appendChild(link);
      textCell.insertAdjacentHTML("afterbegin", "<!-- field:text -->");
      cells.push([imageCell, textCell]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "cards-articles",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/tabs-showcase.js
  function parse4(element, { document }) {
    const cells = [];
    const tabLinks = element.querySelectorAll('.w-tab-link, [role="tab"]');
    const tabPanes = element.querySelectorAll('.w-tab-pane, [role="tabpanel"]');
    tabLinks.forEach((tabLink, index) => {
      const labelElement = tabLink.querySelector("div, span");
      const label = labelElement ? labelElement.textContent.trim() : tabLink.textContent.trim();
      const pane = tabPanes[index];
      if (!pane) return;
      const heading = pane.querySelector("h3, h2");
      const img = pane.querySelector("img");
      const labelCell = document.createElement("div");
      labelCell.insertAdjacentHTML("afterbegin", "<!-- field:tabLabel -->");
      const labelP = document.createElement("p");
      labelP.textContent = label;
      labelCell.appendChild(labelP);
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.appendChild(h3);
      }
      contentCell.insertAdjacentHTML("afterbegin", "<!-- field:tabContent -->");
      if (img) {
        const picture = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        picture.appendChild(imgClone);
        contentCell.appendChild(picture);
      }
      cells.push([labelCell, contentCell]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "tabs-showcase",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const cells = [];
    const accordionItems = element.querySelectorAll(".accordion, .w-dropdown");
    accordionItems.forEach((item) => {
      const toggleElement = item.querySelector('.w-dropdown-toggle, [role="button"]');
      const questionElement = toggleElement ? toggleElement.querySelector(".paragraph-lg, div:not(.dropdown-icon)") : null;
      const question = questionElement ? questionElement.textContent.trim() : "";
      const contentElement = item.querySelector(".accordion-content, .w-dropdown-list");
      const answerElement = contentElement ? contentElement.querySelector(".rich-text p, p") : null;
      const answer = answerElement ? answerElement.textContent.trim() : "";
      if (!question) return;
      const questionCell = document.createElement("div");
      questionCell.insertAdjacentHTML("afterbegin", "<!-- field:title -->");
      const questionP = document.createElement("p");
      questionP.textContent = question;
      questionCell.appendChild(questionP);
      const answerCell = document.createElement("div");
      answerCell.insertAdjacentHTML("afterbegin", "<!-- field:content -->");
      if (answer) {
        const answerP = document.createElement("p");
        answerP.textContent = answer;
        answerCell.appendChild(answerP);
      }
      cells.push([questionCell, answerCell]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "accordion-faq",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      const overlaySelectors = [
        ".cookie-banner",
        ".consent-banner",
        "[data-cookie]",
        ".modal",
        ".popup",
        ".overlay"
      ];
      overlaySelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const scriptSelectors = ["script", "style", "noscript", 'link[rel="stylesheet"]'];
      scriptSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const allElements = document.querySelectorAll("*");
      allElements.forEach((el) => {
        const attrs = [...el.attributes];
        attrs.forEach((attr) => {
          if (attr.name.startsWith("data-w-") || attr.name.startsWith("data-wf-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      const dropdownLists = document.querySelectorAll(".w-dropdown-list, .w-tab-pane");
      dropdownLists.forEach((el) => {
        el.removeAttribute("aria-hidden");
        el.style.removeProperty("display");
      });
    }
    if (hookName === "afterTransform") {
      const navSelectors = [
        ".nav",
        ".secondary-nav",
        "nav",
        '[role="navigation"]',
        '[role="banner"]',
        ".w-nav",
        ".navbar"
      ];
      navSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const footerSelectors = [
        "footer",
        ".footer",
        '[role="contentinfo"]',
        ".footer-section"
      ];
      footerSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const hiddenSelectors = [
        ".w-condition-invisible"
      ];
      hiddenSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const cleanupSelectors = [
        "iframe",
        "form:not([data-keep])",
        ".social-links",
        ".social-icons"
      ];
      cleanupSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      });
      const emptyDivs = document.querySelectorAll("div:empty");
      emptyDivs.forEach((div) => {
        if (!div.querySelector("*") && !div.textContent.trim()) {
          div.remove();
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-image-pair": parse,
    "cards-icon-features": parse2,
    "cards-articles": parse3,
    "tabs-showcase": parse4,
    "accordion-faq": parse5
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main landing page with hero, featured content, and promotional sections",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-image-pair",
        instances: ["header.section .w-layout-grid.y-top"]
      },
      {
        name: "cards-icon-features",
        instances: ["section.section:not(.secondary-section):not(.inverse-section) .w-layout-grid.desktop-4-column.tablet-3-column"]
      },
      {
        name: "cards-articles",
        instances: [".w-layout-grid.tablet-1-column.grid-gap-md"],
        section: "highlight"
      },
      {
        name: "tabs-showcase",
        instances: ["section.section.inverse-section .w-tabs"],
        section: "dark"
      },
      {
        name: "accordion-faq",
        instances: [".small-container .flex-vertical"],
        section: "highlight"
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
     * Uses the 'one input / multiple outputs' pattern with transform()
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
