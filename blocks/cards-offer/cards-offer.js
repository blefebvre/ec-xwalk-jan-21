export default function decorate(block) {
  // Cards offer block decoration
  const cards = [...block.children];
  cards.forEach((card) => {
    card.classList.add('card-offer');
  });
}
