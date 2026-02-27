import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Restructure nav columns: group each h2 + ul pair into a column div
  const sections = footer.querySelectorAll('.section');
  sections.forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper');
    if (!wrapper) return;
    const headings = wrapper.querySelectorAll('h2');
    if (headings.length > 1) {
      // This is the nav columns section — group h2+ul pairs into columns
      section.classList.add('footer-nav');
      const columns = document.createElement('div');
      columns.className = 'footer-nav-columns';
      headings.forEach((h2) => {
        const col = document.createElement('div');
        col.className = 'footer-nav-col';
        col.append(h2);
        const ul = wrapper.querySelector('ul');
        if (ul) col.append(ul);
        columns.append(col);
      });
      wrapper.replaceWith(columns);
    }
  });

  // Mark logo section
  const firstSection = footer.querySelector('.section');
  if (firstSection) {
    const p = firstSection.querySelector('p');
    if (p && p.querySelector('a') && !firstSection.querySelector('h2')) {
      firstSection.classList.add('footer-logo');
    }
  }

  // Mark legal section (last section)
  const allSections = footer.querySelectorAll('.section');
  const lastSection = allSections[allSections.length - 1];
  if (lastSection && !lastSection.classList.contains('footer-nav')) {
    lastSection.classList.add('footer-legal');
  }

  block.append(footer);
}
