/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import formNewsletterParser from './parsers/form-newsletter.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import firstnetTransformer from './transformers/firstnet.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'cards-insights': cardsInsightsParser,
  'form-newsletter': formNewsletterParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  firstnetTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'power-of-firstnet',
  description: 'Power of FirstNet page showcasing network capabilities, features, and value propositions',
  urls: [
    'https://www.firstnet.com/power-of-firstnet.html'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.marquee-heading']
    },
    {
      name: 'columns',
      instances: ['.image-text .image-text-container']
    },
    {
      name: 'cards-insights',
      instances: ['.content-teaser .list-wrapper']
    },
    {
      name: 'form-newsletter',
      instances: ['.email-signup']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.marquee-heading',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Introduction',
      selector: ['.segment-heading:has(h3.no-title)', '.segment-heading h3.no-title'],
      style: null,
      blocks: [],
      defaultContent: ['.segment-heading h3', '.text .wrapper p', '.call-to-action .cta-btn a']
    },
    {
      id: 'section-3',
      name: 'Video Feature',
      selector: '#agencies-choose-firstnet',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.segment-heading h3']
    },
    {
      id: 'section-4',
      name: 'Content Teasers',
      selector: '.content-teaser',
      style: null,
      blocks: ['cards-insights'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Email Signup',
      selector: '.email-signup',
      style: 'dark',
      blocks: ['form-newsletter'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
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

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // Fetch raw HTML source for parsers that need pre-JS-execution data (e.g., lazy-loaded bg images)
    let rawHtml = null;
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', params.originalURL || url, false);
      xhr.send();
      if (xhr.status === 200) {
        rawHtml = xhr.responseText;
      }
    } catch (e) {
      console.warn('Failed to fetch raw HTML:', e.message);
    }

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

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
