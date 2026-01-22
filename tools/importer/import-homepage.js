/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import columnsHeroImagesParser from './parsers/columns-hero-images.js';
import cardsFeaturesParser from './parsers/cards-features.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import tabsShowcaseParser from './parsers/tabs-showcase.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-hero-images': columnsHeroImagesParser,
  'cards-features': cardsFeaturesParser,
  'cards-articles': cardsArticlesParser,
  'tabs-showcase': tabsShowcaseParser,
  'accordion-faq': accordionFaqParser,
  'columns-cta': columnsCtaParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  wkndTrendsettersCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage with hero and featured content',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'columns-hero-images',
      instances: ['header .w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md']
    },
    {
      name: 'cards-features',
      instances: ['.section:not(.secondary-section):not(.inverse-section) .grid-layout.desktop-4-column.tablet-3-column']
    },
    {
      name: 'section-style-stories',
      instances: ['section.secondary-section:nth-of-type(1)'],
      section: 'highlight'
    },
    {
      name: 'cards-articles',
      instances: ['.secondary-section .grid-layout.tablet-1-column.grid-gap-md']
    },
    {
      name: 'section-tabs',
      instances: ['section.inverse-section'],
      section: 'dark'
    },
    {
      name: 'tabs-showcase',
      instances: ['.w-tabs']
    },
    {
      name: 'section-faq',
      instances: ['section.secondary-section:nth-of-type(2)'],
      section: 'highlight'
    },
    {
      name: 'accordion-faq',
      instances: ['.small-container .flex-vertical']
    },
    {
      name: 'columns-cta',
      instances: ['section:not(.secondary-section):not(.inverse-section):last-of-type .grid-layout.desktop-4-column.y-center']
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
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

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
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

/**
 * Add section metadata block after a section element
 * @param {Document} document - The DOM document
 * @param {Element} sectionElement - The section element
 * @param {string} style - The section style (e.g., 'highlight', 'dark')
 */
function addSectionMetadata(document, sectionElement, style) {
  const cells = [
    ['Section Metadata'],
    ['style', style]
  ];
  const metadataBlock = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: cells.slice(1).map(row => row.map(cell => {
      const el = document.createElement('span');
      el.textContent = cell;
      return el;
    }))
  });

  // Append the section metadata to the end of the section
  sectionElement.appendChild(metadataBlock);
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    const parsedBlocks = [];
    pageBlocks.forEach(block => {
      // Handle section styling entries (add section-metadata)
      if (block.name.startsWith('section-') && block.section) {
        addSectionMetadata(document, block.element, block.section);
        parsedBlocks.push(block.name);
        return;
      }

      // Parse regular blocks
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
        blocks: parsedBlocks,
      }
    }];
  }
};
