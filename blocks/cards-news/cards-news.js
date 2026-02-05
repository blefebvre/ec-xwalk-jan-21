export default function decorate(block) {
  // Cards news block decoration
  const cards = [...block.children];
  cards.forEach((card) => {
    card.classList.add('card-news');
  });
}
