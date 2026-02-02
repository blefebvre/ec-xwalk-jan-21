/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-solutions block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: hero
 *
 * Block Structure (from model):
 * - Row 1: Image (optional)
 * - Row 2: Text content (heading, description)
 *
 * Source HTML Pattern (from cleaned.html):
 * <div class="mega-banner">
 *   <section class="component-mega-banner">
 *     <div class="container">
 *       <div class="mega-content">
 *         <div class="mega-left-clm">
 *           <img src="..." alt="colored-bar">
 *           <h1>Heading</h1>
 *           <p>Description</p>
 *         </div>
 *       </div>
 *     </div>
 *   </section>
 * </div>
 *
 * Model fields: image, imageAlt (collapsed), text
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  // Extract content from source HTML
  // Using validated selectors from cleaned.html DOM structure
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('.mega-left-clm h1');

  const description = element.querySelector('.mega-left-clm p') ||
                      element.querySelector('p');

  // Check for hero image (decorative bar in source)
  const heroImage = element.querySelector('.mega-left-clm img') ||
                    element.querySelector('img');

  // Build cells array matching model structure
  const cells = [];

  // Row 1: Image with field hint (if present)
  if (heroImage) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(heroImage.cloneNode(true));
    cells.push([imageCell]);
  }

  // Row 2: Text content (heading + description)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading.cloneNode(true));
  if (description) textCell.appendChild(description.cloneNode(true));
  cells.push([textCell]);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-solutions', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
