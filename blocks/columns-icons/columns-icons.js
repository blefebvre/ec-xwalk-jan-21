export default function decorate(block) {
  // Columns icons block decoration
  const columns = [...block.children];
  columns.forEach((column) => {
    column.classList.add('column-icon');
  });
}
