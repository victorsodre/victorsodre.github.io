const cards = [...document.querySelectorAll('[data-project]')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#search');
const status = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
let category = 'todos';
const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
function update() {
  const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const card of cards) {
    const matches = category === 'todos' || (category === 'codigo' ? !['interativo', '3d'].includes(card.dataset.kind) : card.dataset.kind === category);
    card.hidden = !matches || !terms.every((term) => normalize(card.dataset.search).includes(term));
    if (!card.hidden) count += 1;
  }
  status.textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
  empty.hidden = count > 0;
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
}
filters.forEach((button) => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
search.addEventListener('input', update);
document.querySelector('#reset').addEventListener('click', () => { category = 'todos'; search.value = ''; update(); search.focus(); });
document.querySelector('#discovery-controls').hidden = false;
update();
