/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroParser from './parsers/hero.js';
import columnsIconsParser from './parsers/columns-icons.js';
import cardsParser from './parsers/cards.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import columnsParser from './parsers/columns.js';
import accordionParser from './parsers/accordion.js';
import formNewsletterParser from './parsers/form-newsletter.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import firstnetTransformer from './transformers/firstnet.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-icons': columnsIconsParser,
  'cards': cardsParser,
  'cards-insights': cardsInsightsParser,
  'columns': columnsParser,
  'accordion': accordionParser,
  'form-newsletter': formNewsletterParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  firstnetTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'why-firstnet',
  description: 'Why FirstNet informational page explaining the benefits and features of FirstNet',
  urls: [
    'https://www.firstnet.com/why-firstnet.html'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.marquee-heading']
    },
    {
      name: 'columns-icons',
      instances: ['.icon-grid-description']
    },
    {
      name: 'cards',
      instances: ['.new-offers-card']
    },
    {
      name: 'cards-insights',
      instances: ['.content-teaser .list-wrapper']
    },
    {
      name: 'columns',
      instances: ['.image-text', '.icon-list']
    },
    {
      name: 'accordion',
      instances: ['.accordion']
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
      id: 'section-3',
      name: 'Benefits',
      selector: '#benefits',
      style: null,
      blocks: ['columns-icons'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-4',
      name: 'Competitive Comparison',
      selector: '#compare',
      style: null,
      blocks: [],
      defaultContent: ['.segment-heading h2', '.segment-heading h3', '.image-heading img']
    },
    {
      id: 'section-5',
      name: 'Eligibility',
      selector: '#eligibility',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-6',
      name: 'FirstNet Promise',
      selector: '#firstnet-promise',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-7',
      name: 'First Responder Insights',
      selector: '#insights',
      style: null,
      blocks: ['cards-insights'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-8',
      name: 'FAQ',
      selector: '#faq',
      style: null,
      blocks: ['accordion'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-9',
      name: 'Get Started',
      selector: '#get-started',
      style: 'grey',
      blocks: ['columns'],
      defaultContent: ['.segment-heading h2', '.segment-heading h3']
    },
    {
      id: 'section-10',
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
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  // Find all block instances defined in the template
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
    // payload.html is the rendered DOM (post-JS), where lazy loaders have stripped image URLs
    let rawHtml = null;
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', params.originalURL || url, false); // synchronous
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
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
