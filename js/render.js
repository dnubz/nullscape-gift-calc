// ═══════════════════════════════════════════════════════════
//  VALUE → CSS CLASS
// ═══════════════════════════════════════════════════════════
function valClass(v) {
    if (v >= 300) return 'val-red';
    if (v >= 200) return 'val-orange';
    if (v >= 100) return 'val-yellow';
    return 'val-gray';
}

// ═══════════════════════════════════════════════════════════
//  RENDER CURSE GRID
// ═══════════════════════════════════════════════════════════
function renderGrid() {
    const grid = document.getElementById('curse-grid');
    const filtered = CURSES.filter(c => {
        const catMatch = activeCategory === 'all' || c.cat === activeCategory;
        const q = searchTerm.toLowerCase();
        const textMatch = !q || c.name.toLowerCase().includes(q) || (c.enemy && c.enemy.toLowerCase().includes(q)) || c.effect.toLowerCase().includes(q);
        return catMatch && textMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="grid-empty">No curses match.</div>';
        return;
    }

    // Group by enemy type when in enemy tab
    let html = '';
    if (activeCategory === 'enemy' && !searchTerm) {
        const groups = {};
        filtered.forEach(c => {
            const g = c.enemy || 'Other';
            if (!groups[g]) groups[g] = [];
            groups[g].push(c);
        });
        for (const [group, curses] of Object.entries(groups)) {
            html += `<div class="group-label">${group}</div>`;
            html += curses.map(c => curseCard(c)).join('');
        }
    } else {
        html = filtered.map(c => curseCard(c)).join('');
    }
    grid.innerHTML = html;

    // Attach click handlers
    grid.querySelectorAll('.curse-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            if (selected.has(name)) selected.delete(name);
            else selected.add(name);
            renderGrid();
            renderResult();
        });
    });
}

function curseCard(c) {
    const active = selected.has(c.name);
    const imgSrc = imgUrl(c.img);
    return `<div class="curse-card${active ? ' curse-card--active' : ''}" data-name="${c.name}" title="${c.altText}">
        <img class="cc-img" src="${imgSrc}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'">
        <div class="cc-name">${c.name}</div>
        <div class="cc-lvl">Lv.${c.minLvl}+${c.enemy ? ` · ${c.enemy}` : ''}</div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
//  RENDER PURIFICATION RESULT
// ═══════════════════════════════════════════════════════════
function renderResult() {
    const list = document.getElementById('purification-list');
    const infoBox = document.getElementById('info-box');
    const countEl = document.getElementById('selected-count');

    const sorted = CURSES
        .filter(c => selected.has(c.name))
        .sort((a, b) => b.value - a.value);

    const n = sorted.length;
    countEl.textContent = n === 0 ? '0 curses selected' : n === 1 ? '1 curse selected' : `${n} curses selected`;

    if (n === 0) {
        list.innerHTML = `<div class="puri-empty"><span class="puri-empty-icon">🪦</span><span>Select curses on the left</span></div>`;
        infoBox.style.display = 'none';
        return;
    }

    infoBox.style.display = '';
    document.getElementById('info-next').textContent = sorted[0].name;
    document.getElementById('info-total').textContent = sorted.reduce((s, c) => s + c.value, 0);

    const nothingRow = document.getElementById('nothing-row');
    nothingRow.style.display = selected.has('Nothing?') ? '' : 'none';

    list.innerHTML = sorted.map((c, i) => {
        const vc = valClass(c.value);
        return `<div class="puri-row${i === 0 ? ' puri-first' : ''}">
            <span class="puri-num">${i + 1}</span>
            <img class="puri-img" src="${imgUrl(c.img)}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'">
            <div class="puri-info">
                <span class="puri-name">${c.name}</span>
                <span class="puri-effect">${c.effect}</span>
            </div>
            <span class="badge ${vc} puri-val">${c.value}</span>
        </div>`;
    }).join('');
}
