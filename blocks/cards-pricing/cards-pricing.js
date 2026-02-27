import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, i) => {
      if (i === 0) div.className = 'cards-pricing-name';
      else div.className = 'cards-pricing-details';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
