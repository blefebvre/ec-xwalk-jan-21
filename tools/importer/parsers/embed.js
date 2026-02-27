/* eslint-disable */
/* global WebImporter */

/**
 * Embed block parser
 * Extracts iframe URLs from embedded content (maps, videos, etc.)
 *
 * Handles:
 * 1. Direct iframe elements in the DOM
 * 2. Inline scripts that use document.write() to create iframes
 * 3. Raw HTML source fallback for dynamically loaded iframes
 *
 * Expected output structure:
 * Single row with 1 cell:
 * - Column 1: Link to the embedded resource URL
 */

export default function parse(element, { document, html }) {
  const cells = [];
  let iframeSrc = null;

  // Method 1: Direct iframe in DOM
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    iframeSrc = iframe.src;
  }

  // Method 2: Extract from inline script (document.write pattern)
  if (!iframeSrc) {
    const scripts = element.querySelectorAll('script');
    const candidates = [];
    scripts.forEach((script) => {
      if (script.textContent) {
        const matches = script.textContent.matchAll(/iframe\s+src=["']([^"']+)["']/g);
        for (const m of matches) {
          candidates.push(m[1]);
        }
      }
    });
    if (candidates.length > 0) {
      iframeSrc = candidates.find((url) => !url.includes('mobile')) || candidates[0];
    }
  }

  // Method 3: Raw HTML fallback
  if (!iframeSrc && html) {
    const classMatch = element.className.match(/(\S+)/);
    const className = classMatch ? classMatch[0] : '';
    if (className) {
      const regex = new RegExp(`class="[^"]*${className}[^"]*"[\\s\\S]*?iframe\\s+src=["']([^"']+)["']`);
      const match = html.match(regex);
      if (match) {
        iframeSrc = match[1];
      }
    }
  }

  // If we found a mobile URL, use raw HTML to find the desktop alternative
  if (iframeSrc && iframeSrc.includes('-mobile') && html) {
    const allIframes = [...html.matchAll(/iframe\s+src=["']([^"']+)["']/g)];
    const desktopUrl = allIframes.map((m) => m[1]).find((url) => !url.includes('mobile'));
    if (desktopUrl) {
      iframeSrc = desktopUrl;
    }
  }

  if (iframeSrc) {
    // Resolve relative URLs
    if (iframeSrc.startsWith('/')) {
      iframeSrc = `https://www.firstnet.com${iframeSrc}`;
    }
    const row = [];
    const cell = document.createElement('div');
    const anchor = document.createElement('a');
    anchor.href = iframeSrc;
    anchor.textContent = iframeSrc;
    cell.appendChild(anchor);
    row.push(cell);
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Embed',
    cells,
  });

  element.replaceWith(block);
}
