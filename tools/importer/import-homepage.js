/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import columnsImagePairParser from './parsers/columns-image-pair.js';
import cardsIconFeaturesParser from './parsers/cards-icon-features.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import tabsShowcaseParser from './parsers/tabs-showcase.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import cleanupTransformer from './transformers/cleanup.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-image-pair': columnsImagePairParser,
  'cards-icon-features': cardsIconFeaturesParser,
  'cards-articles': cardsArticlesParser,
  'tabs-showcase': tabsShowcaseParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main landing page with hero, featured content, and promotional sections',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'columns-image-pair',
      instances: ['header.section .w-layout-grid.y-top']
    },
    {
      name: 'cards-icon-features',
      instances: ['section.section:not(.secondary-section):not(.inverse-section) .w-layout-grid.desktop-4-column.tablet-3-column']
    },
    {
      name: 'cards-articles',
      instances: ['.w-layout-grid.tablet-1-column.grid-gap-md'],
      section: 'highlight'
    },
    {
      name: 'tabs-showcase',
      instances: ['section.section.inverse-section .w-tabs'],
      section: 'dark'
    },
    {
      name: 'accordion-faq',
      instances: ['.small-container .flex-vertical'],
      section: 'highlight'
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  // Find all block instances defined in the template
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   * Uses the 'one input / multiple outputs' pattern with transform()
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
