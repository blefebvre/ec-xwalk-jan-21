/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroParser from './parsers/hero.js';
import tabsParser from './parsers/tabs.js';
import columnsIconsParser from './parsers/columns-icons.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import formNewsletterParser from './parsers/form-newsletter.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import firstnetTransformer from './transformers/firstnet.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'tabs': tabsParser,
  'columns-icons': columnsIconsParser,
  'cards-pricing': cardsPricingParser,
  'form-newsletter': formNewsletterParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  firstnetTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'plans-page',
  description: 'FirstNet rate plans page with individual, agency, and international plan pricing, tabbed sections, and comparison cards',
  urls: [
    'https://www.firstnet.com/plans.html'
  ],
  blocks: [
    {
      name: 'tabs',
      instances: ['.tabs.parbase']
    },
    {
      name: 'columns-icons',
      instances: ['.icon-list']
    },
    {
      name: 'hero',
      instances: ['.marquee-heading']
    },
    {
      name: 'cards-pricing',
      instances: ['.table-comparison']
    },
    {
      name: 'form-newsletter',
      instances: ['.email-signup']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Header',
      selector: '.text.parbase:first-child',
      style: null,
      blocks: [],
      defaultContent: ['.text h1', '.text h4', '.sticky-nav']
    },
    {
      id: 'section-2',
      name: 'Individual Plans',
      selector: '#individual-plans',
      style: null,
      blocks: ['tabs'],
      defaultContent: ['.segment-heading h3']
    },
    {
      id: 'section-3',
      name: 'Rate Plan Features',
      selector: '.icon-list',
      style: null,
      blocks: ['columns-icons'],
      defaultContent: ['.segment-heading h3']
    },
    {
      id: 'section-4',
      name: 'Promo',
      selector: '.marquee-heading',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Agency Plans',
      selector: '#agency-plans',
      style: null,
      blocks: ['tabs'],
      defaultContent: ['.segment-heading h3']
    },
    {
      id: 'section-6',
      name: 'International Plans',
      selector: '#international-plans',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['.segment-heading h3', '.call-to-action a']
    },
    {
      id: 'section-7',
      name: 'Contact',
      selector: '.segment-heading:has(h2)',
      style: null,
      blocks: [],
      defaultContent: ['.segment-heading h2', '.segment-heading h3', '.call-to-action a']
    },
    {
      id: 'section-8',
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

    // Fetch raw HTML source for parsers that need pre-JS-execution data
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
