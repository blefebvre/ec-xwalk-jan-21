/* eslint-disable */
/* global WebImporter */

/**
 * Import script for homepage template
 * Template: Homepage with hero and featured content sections
 * Generated: 2026-01-21
 */

// PARSER IMPORTS - Import all parsers needed for this template
import columnsHeroParser from './parsers/columns-hero.js';
import cardsFeaturesParser from './parsers/cards-features.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import tabsShowcaseParser from './parsers/tabs-showcase.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-hero': columnsHeroParser,
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
  description: 'Homepage template with hero and featured content sections',
  urls: [
    'https://wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'columns-hero',
      instances: ['header .w-layout-grid.grid-layout.y-top']
    },
    {
      name: 'cards-features',
      instances: ['section.section > .container > .w-layout-grid.desktop-4-column']
    },
    {
      name: 'section-articles',
      instances: ['.section.secondary-section:first-of-type'],
      section: 'grey'
    },
    {
      name: 'cards-articles',
      instances: ['.section.secondary-section .w-layout-grid.tablet-1-column']
    },
    {
      name: 'section-tabs',
      instances: ['.section.inverse-section'],
      section: 'dark'
    },
    {
      name: 'tabs-showcase',
      instances: ['.section.inverse-section .w-tabs']
    },
    {
      name: 'section-faq',
      instances: ['.section.secondary-section:nth-of-type(2)'],
      section: 'grey'
    },
    {
      name: 'accordion-faq',
      instances: ['.flex-vertical .accordion.w-dropdown']
    },
    {
      name: 'columns-cta',
      instances: ['section.section:last-of-type .w-layout-grid.desktop-4-column.y-center']
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
 * Create a section metadata block for section styling
 * @param {Document} document - The DOM document
 * @param {string} style - The section style (e.g., 'grey', 'dark')
 * @returns {Element} The section metadata table element
 */
function createSectionMetadata(document, style) {
  return WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [['style', style]]
  });
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
    // Section blocks get section-metadata, content blocks get parsed
    pageBlocks.forEach(block => {
      // Handle section markers (create section-metadata)
      if (block.name.startsWith('section-') && block.section) {
        try {
          const sectionMetadata = createSectionMetadata(document, block.section);
          // Insert section metadata before the section content
          if (block.element.firstChild) {
            block.element.insertBefore(sectionMetadata, block.element.firstChild);
          } else {
            block.element.appendChild(sectionMetadata);
          }
        } catch (e) {
          console.error(`Failed to create section metadata for ${block.name}:`, e);
        }
        return; // Don't try to parse section markers
      }

      // Handle content blocks with parsers
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

    // 6. Generate sanitized path
    const urlPath = new URL(params.originalURL).pathname;
    const cleanPath = urlPath.replace(/\/$/, '').replace(/\.html$/, '') || '/index';
    const path = WebImporter.FileUtils.sanitizePath(cleanPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
