// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════
const selected = new Set();
let activeCategory = 'all';
let searchTerm = '';

// ═══════════════════════════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.dataset.cat;
        renderGrid();
    });
});

document.getElementById('search-input').addEventListener('input', e => {
    searchTerm = e.target.value;
    renderGrid();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    selected.clear();
    renderGrid();
    renderResult();
});

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
renderGrid();
renderResult();
