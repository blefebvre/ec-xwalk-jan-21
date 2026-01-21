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

  // tools/importer/parsers/columns-hero.js
  function parse(element, { document }) {
    const images = element.querySelectorAll("img");
    const cells = [];
    const row = [];
    images.forEach((img) => {
      const imgClone = img.cloneNode(true);
      row.push(imgClone);
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns-Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-features.js
  function parse2(element, { document }) {
    const cells = [];
    const featureItems = element.querySelectorAll(".flex-horizontal.flex-gap-xxs");
    featureItems.forEach((item) => {
      const row = [];
      const iconContainer = document.createElement("div");
      iconContainer.appendChild(document.createComment(" field:image "));
      const iconDiv = item.querySelector(".icon");
      if (iconDiv) {
        const svg = iconDiv.querySelector("svg");
        if (svg) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svg);
          const dataUri = "data:image/svg+xml," + encodeURIComponent(svgString);
          const img = document.createElement("img");
          img.src = dataUri;
          img.alt = "icon";
          iconContainer.appendChild(img);
        }
      }
      row.push(iconContainer);
      const textContainer = document.createElement("div");
      textContainer.appendChild(document.createComment(" field:text "));
      const paragraph = item.querySelector("p");
      if (paragraph) {
        const p = document.createElement("p");
        p.textContent = paragraph.textContent;
        textContainer.appendChild(p);
      }
      row.push(textContainer);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards-Features",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse3(element, { document }) {
    const cells = [];
    const articleCards = element.querySelectorAll(".utility-link-content-block");
    articleCards.forEach((card) => {
      const row = [];
      const imageContainer = document.createElement("div");
      imageContainer.appendChild(document.createComment(" field:image "));
      const img = card.querySelector("img");
      if (img) {
        const imgClone = img.cloneNode(true);
        imageContainer.appendChild(imgClone);
      }
      row.push(imageContainer);
      const textContainer = document.createElement("div");
      textContainer.appendChild(document.createComment(" field:text "));
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagSpan = document.createElement("em");
        tagSpan.textContent = tag.textContent.trim();
        textContainer.appendChild(tagSpan);
        textContainer.appendChild(document.createTextNode(" "));
      }
      const readTime = card.querySelector(".paragraph-sm");
      if (readTime) {
        const timeSpan = document.createElement("span");
        timeSpan.textContent = readTime.textContent.trim();
        textContainer.appendChild(timeSpan);
        textContainer.appendChild(document.createElement("br"));
      }
      const heading = card.querySelector("h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent;
        textContainer.appendChild(h3);
      }
      const description = card.querySelector("p:not(.paragraph-sm)");
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent;
        textContainer.appendChild(p);
      }
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = "Read";
        textContainer.appendChild(link);
      }
      row.push(textContainer);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards-Articles",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-showcase.js
  function parse4(element, { document }) {
    const cells = [];
    const tabLinks = element.querySelectorAll(".w-tab-link");
    const tabPanes = element.querySelectorAll(".w-tab-pane");
    tabLinks.forEach((tabLink, index) => {
      const row = [];
      const pane = tabPanes[index];
      const titleContainer = document.createElement("div");
      titleContainer.appendChild(document.createComment(" field:title "));
      const titleText = tabLink.textContent.trim();
      const titleSpan = document.createElement("strong");
      titleSpan.textContent = titleText;
      titleContainer.appendChild(titleSpan);
      row.push(titleContainer);
      const contentContainer = document.createElement("div");
      if (pane) {
        const heading = pane.querySelector("h3, h2");
        if (heading) {
          contentContainer.appendChild(document.createComment(" field:content_heading "));
          const h = document.createElement(heading.tagName.toLowerCase());
          h.textContent = heading.textContent;
          contentContainer.appendChild(h);
        }
        const img = pane.querySelector("img");
        if (img) {
          contentContainer.appendChild(document.createComment(" field:content_image "));
          const imgClone = img.cloneNode(true);
          contentContainer.appendChild(imgClone);
        }
        const additionalText = pane.querySelector("p");
        if (additionalText) {
          contentContainer.appendChild(document.createComment(" field:content_richtext "));
          const p = document.createElement("p");
          p.textContent = additionalText.textContent;
          contentContainer.appendChild(p);
        }
      }
      row.push(contentContainer);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Tabs-Showcase",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const cells = [];
    let accordionItems = element.querySelectorAll(".accordion.w-dropdown");
    if (accordionItems.length === 0 && element.classList.contains("accordion")) {
      accordionItems = [element];
    }
    if (accordionItems.length === 0) {
      const parent = element.closest(".flex-vertical");
      if (parent) {
        accordionItems = parent.querySelectorAll(".accordion.w-dropdown");
      }
    }
    accordionItems.forEach((accordion) => {
      const row = [];
      const questionContainer = document.createElement("div");
      questionContainer.appendChild(document.createComment(" field:summary "));
      const questionText = accordion.querySelector(".paragraph-lg");
      if (questionText) {
        const strong = document.createElement("strong");
        strong.textContent = questionText.textContent.trim();
        questionContainer.appendChild(strong);
      }
      row.push(questionContainer);
      const answerContainer = document.createElement("div");
      answerContainer.appendChild(document.createComment(" field:text "));
      const answerContent = accordion.querySelector(".accordion-content .rich-text, .accordion-content .w-richtext");
      if (answerContent) {
        const paragraphs = answerContent.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const para = document.createElement("p");
          para.textContent = p.textContent;
          answerContainer.appendChild(para);
        });
      } else {
        const contentArea = accordion.querySelector(".accordion-content");
        if (contentArea) {
          const p = document.createElement("p");
          p.textContent = contentArea.textContent.trim();
          answerContainer.appendChild(p);
        }
      }
      row.push(answerContainer);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Accordion-Faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse6(element, { document }) {
    const cells = [];
    const columns = element.querySelectorAll(":scope > div");
    if (columns.length >= 2) {
      const row = [];
      const textColumn = columns[0];
      const textContainer = document.createElement("div");
      const heading = textColumn.querySelector("h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent;
        textContainer.appendChild(h2);
      }
      const paragraph = textColumn.querySelector("p");
      if (paragraph) {
        const p = document.createElement("p");
        p.textContent = paragraph.textContent;
        textContainer.appendChild(p);
      }
      row.push(textContainer);
      const buttonColumn = columns[1];
      const buttonContainer = document.createElement("div");
      const buttons = buttonColumn.querySelectorAll("a.button");
      buttons.forEach((btn) => {
        const link = document.createElement("a");
        link.href = btn.getAttribute("href") || "#";
        link.textContent = btn.textContent.trim();
        buttonContainer.appendChild(link);
        buttonContainer.appendChild(document.createElement("br"));
      });
      row.push(buttonContainer);
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns-Cta",
      cells
    });
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
        ".w-nav-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        ".inverse-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".w-nav-button",
        ".w-icon-dropdown-toggle"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith("data-w-") || attr.name.startsWith("data-wf-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-hero": parse,
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
    description: "Homepage template with hero and featured content sections",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero",
        instances: ["header .w-layout-grid.grid-layout.y-top"]
      },
      {
        name: "cards-features",
        instances: ["section.section > .container > .w-layout-grid.desktop-4-column:not(.y-center)"]
      },
      {
        name: "section-articles",
        instances: [".section.secondary-section:first-of-type"],
        section: "grey"
      },
      {
        name: "cards-articles",
        instances: [".section.secondary-section .w-layout-grid.tablet-1-column"]
      },
      {
        name: "section-tabs",
        instances: [".section.inverse-section"],
        section: "dark"
      },
      {
        name: "tabs-showcase",
        instances: [".section.inverse-section .w-tabs"]
      },
      {
        name: "section-faq",
        instances: [".section.secondary-section:nth-of-type(2)"],
        section: "grey"
      },
      {
        name: "accordion-faq",
        instances: [".flex-vertical .accordion.w-dropdown"]
      },
      {
        name: "columns-cta",
        instances: ["section.section:last-of-type .w-layout-grid.desktop-4-column.y-center"]
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
  function createSectionMetadata(document, style) {
    return WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: [["style", style]]
    });
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
        if (block.name.startsWith("section-") && block.section) {
          try {
            const sectionMetadata = createSectionMetadata(document, block.section);
            if (block.element.firstChild) {
              block.element.insertBefore(sectionMetadata, block.element.firstChild);
            } else {
              block.element.appendChild(sectionMetadata);
            }
          } catch (e) {
            console.error(`Failed to create section metadata for ${block.name}:`, e);
          }
          return;
        }
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
      const urlPath = new URL(params.originalURL).pathname;
      const cleanPath = urlPath.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      const path = WebImporter.FileUtils.sanitizePath(cleanPath);
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
