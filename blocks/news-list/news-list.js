/**
 * News List Block
 * Displays a chronological list of news articles with date, title, description, and link.
 * Each row in the block table represents one news article.
 *
 * Content model (per row):
 * | Date | Title | Description | Link |
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'news-list-items';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'news-list-item';

    const cells = [...row.children];

    // Cell 0: Date
    if (cells[0]) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'news-list-date';
      dateDiv.innerHTML = cells[0].innerHTML;
      li.append(dateDiv);
    }

    // Cell 1: Title + Description + Link (richtext content)
    if (cells[1]) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'news-list-content';
      contentDiv.innerHTML = cells[1].innerHTML;
      li.append(contentDiv);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
