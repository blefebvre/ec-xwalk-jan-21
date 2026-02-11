var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-why-firstnet.js
  var import_why_firstnet_exports = {};
  __export(import_why_firstnet_exports, {
    default: () => import_why_firstnet_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
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
    const heading = element.querySelector("h1") || element.querySelector("h2");
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

  // tools/importer/parsers/columns-icons.js
  function parse2(element, { document }) {
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
      name: "Columns-icons",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cells = [];
    const cardTiles = element.querySelectorAll(".card-tile");
    if (cardTiles.length > 0) {
      cardTiles.forEach((card) => {
        const row = [];
        const imageCell = document.createElement("div");
        const img = card.querySelector(".img-section img");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.appendChild(newImg);
        }
        row.push(imageCell);
        const textCell = document.createElement("div");
        const eyebrow = card.querySelector(".eyebrow");
        if (eyebrow) {
          const eyebrowP = document.createElement("p");
          const em = document.createElement("em");
          em.textContent = eyebrow.textContent.trim();
          eyebrowP.appendChild(em);
          textCell.appendChild(eyebrowP);
        }
        const heading = card.querySelector(".heading");
        if (heading) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          textCell.appendChild(h3);
        }
        const bodyText = card.querySelector(".bodyText p");
        if (bodyText) {
          const p = document.createElement("p");
          p.textContent = bodyText.textContent.trim();
          textCell.appendChild(p);
        }
        const cta = card.querySelector(".cta-section a");
        if (cta) {
          const ctaP = document.createElement("p");
          const anchor = document.createElement("a");
          anchor.href = cta.href;
          anchor.textContent = cta.textContent.trim();
          ctaP.appendChild(anchor);
          textCell.appendChild(ctaP);
        }
        row.push(textCell);
        cells.push(row);
      });
    }
    const teaserItems = element.querySelectorAll(".swiper-wrapper .item");
    if (teaserItems.length > 0 && cardTiles.length === 0) {
      teaserItems.forEach((item) => {
        const row = [];
        const imageCell = document.createElement("div");
        const img = item.querySelector(".image-wrapper img") || item.querySelector(".image-wrapper-container img") || item.querySelector("img");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.appendChild(newImg);
        }
        row.push(imageCell);
        const textCell = document.createElement("div");
        const title = item.querySelector(".item-title");
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textCell.appendChild(h3);
        }
        const desc = item.querySelector(".item-description");
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textCell.appendChild(p);
        }
        const link = item.querySelector("a.att-track");
        if (link && link.href) {
          const ctaP = document.createElement("p");
          const anchor = document.createElement("a");
          anchor.href = link.href;
          const ctaText = item.querySelector(".cta-btn .att-button");
          anchor.textContent = ctaText ? ctaText.textContent.trim() : "Read more";
          ctaP.appendChild(anchor);
          textCell.appendChild(ctaP);
        }
        row.push(textCell);
        cells.push(row);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function extractBgUrlsFromRawHtml(html) {
    if (!html) return [];
    const urls = [];
    const pattern = /lzy-background image-wrapper"[^>]*style="[^"]*background-image:\s*url\(([^)]+)\)/g;
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1].replace(/['"]/g, "").trim();
      if (url && !url.startsWith("data:")) {
        urls.push(url);
      }
    }
    return urls;
  }
  function parse4(element, { document, html }) {
    const cells = [];
    const bgUrls = extractBgUrlsFromRawHtml(html);
    const teaserItems = element.querySelectorAll(".swiper-wrapper .item");
    teaserItems.forEach((item, index) => {
      const row = [];
      const imageCell = document.createElement("div");
      let imgUrl = null;
      if (index < bgUrls.length) {
        imgUrl = bgUrls[index];
      }
      if (!imgUrl) {
        const bgEl = item.querySelector('.lzy-background, .image-wrapper, [style*="background-image"]');
        if (bgEl) {
          const styleAttr = bgEl.getAttribute("style") || "";
          const bgMatch = styleAttr.match(/url\(['"]?([^'")\s]+)['"]?\)/);
          if (bgMatch && !bgMatch[1].startsWith("data:")) {
            imgUrl = bgMatch[1];
          }
          if (!imgUrl && bgEl.style && bgEl.style.backgroundImage) {
            const computedMatch = bgEl.style.backgroundImage.match(/url\(['"]?([^'")\s]+)['"]?\)/);
            if (computedMatch && !computedMatch[1].startsWith("data:")) {
              imgUrl = computedMatch[1];
            }
          }
        }
      }
      if (imgUrl) {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "";
        imageCell.appendChild(img);
      }
      row.push(imageCell);
      const textCell = document.createElement("div");
      const title = item.querySelector(".item-title");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.appendChild(h3);
      }
      const desc = item.querySelector(".item-description");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }
      const link = item.querySelector("a.att-track") || item.closest("a");
      if (link && link.href) {
        const ctaP = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.href = link.href;
        const ctaText = item.querySelector(".cta-btn .att-button");
        anchor.textContent = ctaText ? ctaText.textContent.trim() : "Read more";
        ctaP.appendChild(anchor);
        textCell.appendChild(ctaP);
      }
      row.push(textCell);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards-Insights",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse5(element, { document }) {
    const cells = [];
    const imageTextContainer = element.querySelector(".image-text-container");
    if (imageTextContainer) {
      const row = [];
      const imageCell = document.createElement("div");
      const imgEl = imageTextContainer.querySelector(".col-image img");
      if (imgEl) {
        const newImg = document.createElement("img");
        newImg.src = imgEl.src;
        newImg.alt = imgEl.alt || "";
        imageCell.appendChild(newImg);
      }
      row.push(imageCell);
      const textCell = document.createElement("div");
      const title = imageTextContainer.querySelector(".imgtxt-title");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.appendChild(h3);
      }
      const subtitleDiv = imageTextContainer.querySelector(".imgtxt-subtitle");
      if (subtitleDiv) {
        const paragraphs = subtitleDiv.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text) {
            const newP = document.createElement("p");
            newP.textContent = text;
            textCell.appendChild(newP);
          }
        });
      }
      const links = imageTextContainer.querySelectorAll(".col-text > div > a");
      links.forEach((link) => {
        const text = link.textContent.trim();
        if (text && link.href) {
          const ctaP = document.createElement("p");
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.textContent = text;
          ctaP.appendChild(anchor);
          textCell.appendChild(ctaP);
        }
      });
      row.push(textCell);
      cells.push(row);
    }
    const iconListContainer = element.querySelector(".icon-list-container");
    if (iconListContainer && !imageTextContainer) {
      const listItems = iconListContainer.querySelectorAll("ul > li");
      if (listItems.length > 0) {
        const row = [];
        listItems.forEach((li) => {
          const cell = document.createElement("div");
          const icon = li.querySelector(".icon-list-image");
          if (icon) {
            const newImg = document.createElement("img");
            newImg.src = icon.src;
            newImg.alt = icon.alt || "";
            cell.appendChild(newImg);
          }
          const heading = li.querySelector("h3");
          if (heading) {
            const h3 = document.createElement("h3");
            h3.textContent = heading.textContent.trim();
            cell.appendChild(h3);
          }
          const paragraphs = li.querySelectorAll("p");
          paragraphs.forEach((p) => {
            if (p.children.length === 1 && p.querySelector("a")) return;
            const text = p.textContent.trim();
            if (text) {
              const newP = document.createElement("p");
              newP.textContent = text;
              cell.appendChild(newP);
            }
          });
          const link = li.querySelector("p > a");
          if (link) {
            const ctaP = document.createElement("p");
            const anchor = document.createElement("a");
            anchor.href = link.href;
            anchor.textContent = link.textContent.trim();
            ctaP.appendChild(anchor);
            cell.appendChild(ctaP);
          }
          row.push(cell);
        });
        cells.push(row);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse6(element, { document }) {
    const cells = [];
    let faqItems = element.querySelectorAll('[itemprop="mainEntity"]');
    if (faqItems.length === 0) {
      faqItems = element.querySelectorAll(".accordion-block > div > div");
    }
    faqItems.forEach((item) => {
      const row = [];
      const questionCell = document.createElement("div");
      const questionEl = item.querySelector(".accordion-title-content") || item.querySelector(".accordion-title h5") || item.querySelector(".accordion-title");
      if (questionEl) {
        questionCell.textContent = questionEl.textContent.trim();
      }
      row.push(questionCell);
      const answerCell = document.createElement("div");
      const bodyContent = item.querySelector(".accordion-body-content") || item.querySelector(".accordion-body");
      if (bodyContent) {
        const paragraphs = bodyContent.querySelectorAll("p");
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            const text = p.textContent.trim();
            if (text) {
              const newP = document.createElement("p");
              const links = p.querySelectorAll("a");
              if (links.length > 0) {
                Array.from(p.childNodes).forEach((node) => {
                  if (node.nodeType === 3) {
                    newP.appendChild(document.createTextNode(node.textContent));
                  } else if (node.tagName === "A") {
                    const anchor = document.createElement("a");
                    anchor.href = node.href;
                    anchor.textContent = node.textContent;
                    newP.appendChild(anchor);
                  } else {
                    newP.appendChild(document.createTextNode(node.textContent));
                  }
                });
              } else {
                newP.textContent = text;
              }
              answerCell.appendChild(newP);
            }
          });
        } else {
          const text = bodyContent.textContent.trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            answerCell.appendChild(p);
          }
        }
      }
      row.push(answerCell);
      if (questionCell.textContent && answerCell.textContent) {
        cells.push(row);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Accordion",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form-newsletter.js
  function parse7(element, { document }) {
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
      const heroSource = element.querySelector(".marquee-heading");
      if (heroSource) {
        let current = heroSource;
        while (current && current !== element) {
          let sibling = current.previousElementSibling;
          while (sibling) {
            const toRemove = sibling;
            sibling = sibling.previousElementSibling;
            toRemove.remove();
          }
          current = current.parentElement;
        }
      }
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("p").forEach((p) => {
        if (p.closest("table")) return;
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
    const { document, template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;
    const sections = template.sections;
    const claimed = /* @__PURE__ */ new Set();
    function findBlockTable(blockName, searchRoot) {
      const tables = searchRoot.querySelectorAll("table");
      for (const table of tables) {
        if (claimed.has(table)) continue;
        const th = table.querySelector("th");
        if (th) {
          const thText = th.textContent.trim().toLowerCase().replace(/\s+/g, "-");
          if (thText === blockName.toLowerCase()) {
            return table;
          }
        }
      }
      return null;
    }
    const firstTable = element.querySelector("table");
    if (!firstTable) return;
    const contentContainer = firstTable.parentElement;
    if (!contentContainer) return;
    const sectionAnchors = [];
    for (const section of sections) {
      let anchor = null;
      if (section.blocks && section.blocks.length > 0) {
        for (const blockName of section.blocks) {
          const table = findBlockTable(blockName, contentContainer);
          if (table) {
            anchor = table;
            claimed.add(table);
            break;
          }
        }
      }
      if (!anchor && section.defaultContent && section.defaultContent.length > 0) {
        const headings = contentContainer.querySelectorAll("h2");
        for (const h of headings) {
          if (!claimed.has(h)) {
            anchor = h;
            claimed.add(h);
            break;
          }
        }
      }
      sectionAnchors.push({ section, anchor });
    }
    for (let i = 1; i < sectionAnchors.length; i++) {
      const { anchor } = sectionAnchors[i];
      if (!anchor) continue;
      let target = anchor;
      while (target.parentElement && target.parentElement !== contentContainer) {
        target = target.parentElement;
      }
      if (target.parentElement !== contentContainer) continue;
      const prevSection = sectionAnchors[i - 1].section;
      if (prevSection.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: [
            [createTextDiv(document, "style"), createTextDiv(document, prevSection.style)]
          ]
        });
        contentContainer.insertBefore(sectionMetadata, target);
      }
      const hr = document.createElement("hr");
      contentContainer.insertBefore(hr, target);
    }
    const lastSection = sectionAnchors[sectionAnchors.length - 1];
    if (lastSection && lastSection.section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: [
          [createTextDiv(document, "style"), createTextDiv(document, lastSection.section.style)]
        ]
      });
      const metadataTable = findBlockTable("metadata", contentContainer);
      if (metadataTable) {
        contentContainer.insertBefore(sectionMetadata, metadataTable);
      } else {
        contentContainer.appendChild(sectionMetadata);
      }
    }
  }
  function createTextDiv(document, text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
  }

  // tools/importer/import-why-firstnet.js
  var parsers = {
    "hero": parse,
    "columns-icons": parse2,
    "cards": parse3,
    "cards-insights": parse4,
    "columns": parse5,
    "accordion": parse6,
    "form-newsletter": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "why-firstnet",
    description: "Why FirstNet informational page explaining the benefits and features of FirstNet",
    urls: [
      "https://www.firstnet.com/why-firstnet.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".marquee-heading"]
      },
      {
        name: "columns-icons",
        instances: [".icon-grid-description"]
      },
      {
        name: "cards",
        instances: [".new-offers-card"]
      },
      {
        name: "cards-insights",
        instances: [".content-teaser .list-wrapper"]
      },
      {
        name: "columns",
        instances: [".image-text", ".icon-list"]
      },
      {
        name: "accordion",
        instances: [".accordion"]
      },
      {
        name: "form-newsletter",
        instances: [".email-signup"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".marquee-heading",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Benefits",
        selector: "#benefits",
        style: null,
        blocks: ["columns-icons"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-4",
        name: "Competitive Comparison",
        selector: "#compare",
        style: null,
        blocks: [],
        defaultContent: [".segment-heading h2", ".segment-heading h3", ".image-heading img"]
      },
      {
        id: "section-5",
        name: "Eligibility",
        selector: "#eligibility",
        style: null,
        blocks: ["cards"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-6",
        name: "FirstNet Promise",
        selector: "#firstnet-promise",
        style: null,
        blocks: ["columns"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-7",
        name: "First Responder Insights",
        selector: "#insights",
        style: null,
        blocks: ["cards-insights"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-8",
        name: "FAQ",
        selector: "#faq",
        style: null,
        blocks: ["accordion"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-9",
        name: "Get Started",
        selector: "#get-started",
        style: "grey",
        blocks: ["columns"],
        defaultContent: [".segment-heading h2", ".segment-heading h3"]
      },
      {
        id: "section-10",
        name: "Email Signup",
        selector: ".email-signup",
        style: "dark",
        blocks: ["form-newsletter"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
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
  var import_why_firstnet_default = {
    /**
     * Main transformation function
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      let rawHtml = null;
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", params.originalURL || url, false);
        xhr.send();
        if (xhr.status === 200) {
          rawHtml = xhr.responseText;
        }
      } catch (e) {
        console.warn("Failed to fetch raw HTML:", e.message);
      }
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params, html: rawHtml || html });
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
  return __toCommonJS(import_why_firstnet_exports);
})();
