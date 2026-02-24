import { weaponData, armorData, enemyData, itemData } from './data.js';
import { createWeaponCard, createEnemyCard, createArmorCard } from './renderer.js';

const paginationConfig = {
    weapons: { pageSize: 8, currentPage: 1, totalItems: 0 },
    enemies: { pageSize: 8, currentPage: 1, totalItems: 0 },
    armors: { pageSize: 6, currentPage: 1, totalItems: 0 },
    consumables: { pageSize: 10, currentPage: 1, totalItems: 0 },
    materials: { pageSize: 10, currentPage: 1, totalItems: 0 }
};

function getPaginationKey(key) {
    const map = {
        'weapons': 'weapons',
        'enemies': 'enemies',
        'armors': 'armors',
        'armor': 'armors',
        'consumables': 'consumables',
        'materials': 'materials',
        'items': 'consumables'
    };
    return map[key] || key;
}

export function initPagination() {
    console.log('Initializing pagination...');
    console.log('weaponData:', weaponData.length);
    console.log('enemyData:', enemyData.length);
    console.log('armorData:', armorData.length);
    console.log('itemData consumables:', itemData.consumables?.length);
    console.log('itemData materials:', itemData.materials?.length);
    refreshAllPagination();
}

export function refreshAllPagination() {
    paginationConfig.weapons.totalItems = weaponData.length;
    paginationConfig.enemies.totalItems = enemyData ? enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通').length : 0;
    paginationConfig.armors.totalItems = armorData.length;
    paginationConfig.consumables.totalItems = itemData.consumables?.length || 0;
    paginationConfig.materials.totalItems = itemData.materials?.length || 0;

    renderPagination('weapons');
    renderPagination('enemies');
    renderPagination('armors');
    renderPagination('consumables');
    renderPagination('materials');
    
    applyPagination('weapons');
    applyPagination('enemies');
    applyPagination('armors');
    applyPagination('consumables');
    applyPagination('materials');
}

export function refreshPagination(section) {
    const key = getPaginationKey(section);
    if (!paginationConfig[key]) {
        console.warn('refreshPagination: invalid section', section, '-> key:', key);
        return;
    }
    
    if (key === 'weapons') {
        paginationConfig.weapons.totalItems = weaponData.length;
    } else if (key === 'enemies') {
        paginationConfig.enemies.totalItems = enemyData ? enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通').length : 0;
    } else if (key === 'armors') {
        paginationConfig.armors.totalItems = armorData.length;
    } else if (key === 'consumables') {
        paginationConfig.consumables.totalItems = itemData.consumables?.length || 0;
    } else if (key === 'materials') {
        paginationConfig.materials.totalItems = itemData.materials?.length || 0;
    }
    
    renderPagination(key);
    applyPagination(key);
}

export function renderPagination(section) {
    const key = getPaginationKey(section);
    if (!paginationConfig[key]) {
        console.warn('renderPagination: invalid section', section, '-> key:', key);
        return;
    }
    
    const config = paginationConfig[key];

    let sectionId = key;
    if (key === 'weapons') sectionId = 'weapons';
    if (key === 'enemies') sectionId = 'enemies';
    if (key === 'armors') sectionId = 'armor';
    if (key === 'consumables' || key === 'materials') sectionId = 'items';

    let container = document.querySelector(`#${sectionId}`);
    if (!container) {
        console.warn('renderPagination: container not found for', sectionId);
        return;
    }

    let existingPagination = container.querySelector(`.pagination[data-section="${key}"]`);
    if (existingPagination) {
        existingPagination.remove();
    }

    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    if (totalPages <= 1) {
        console.log(`Skipping pagination for ${key}: only ${totalPages} page(s), items: ${config.totalItems}`);
        return;
    }
    
    let html = `<div class="pagination" data-section="${key}">`;
    html += `<button class="pagination-btn prev-page" data-section="${key}" ${config.currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
    
    const maxButtons = 5;
    let startPage = Math.max(1, config.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn page-number ${i === config.currentPage ? 'active' : ''}" data-section="${key}" data-page="${i}">${i}</button>`;
    }
    
    html += `<span class="pagination-info">${config.currentPage}/${totalPages}页</span>`;
    html += `<button class="pagination-btn next-page" data-section="${key}" ${config.currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
    html += '</div>';

    if (key === 'consumables') {
        const consumablesContainer = container.querySelector('.consumables-table');
        if (consumablesContainer) {
            consumablesContainer.insertAdjacentHTML('afterend', html);
        }
    } else if (key === 'materials') {
        const materialsContainer = container.querySelector('.materials-table');
        if (materialsContainer) {
            materialsContainer.insertAdjacentHTML('afterend', html);
        }
    } else if (key === 'enemies') {
        const normalGrid = container.querySelector('#normal-enemies');
        if (normalGrid) {
            normalGrid.insertAdjacentHTML('afterend', html);
        }
    } else {
        container.insertAdjacentHTML('beforeend', html);
    }

    const paginationContainer = container.querySelector(`.pagination[data-section="${key}"]`);
    if (paginationContainer) {
        paginationContainer.addEventListener('click', function(e) {
            const target = e.target;
            const section = this.dataset.section;
            
            if (target.classList.contains('prev-page')) {
                changePage(section, -1);
            } else if (target.classList.contains('next-page')) {
                changePage(section, 1);
            } else if (target.classList.contains('page-number')) {
                const page = parseInt(target.dataset.page);
                goToPage(section, page);
            }
        });
    }
}

export function changePage(section, delta) {
    const key = getPaginationKey(section);
    const config = paginationConfig[key];
    if (!config) return;
    
    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    const newPage = config.currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        config.currentPage = newPage;
        renderPagination(key);
        applyPagination(key);
    }
}

export function goToPage(section, page) {
    const key = getPaginationKey(section);
    const config = paginationConfig[key];
    if (!config) return;
    
    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    
    if (page >= 1 && page <= totalPages) {
        config.currentPage = page;
        renderPagination(key);
        applyPagination(key);
    }
}

export function applyPagination(section) {
    const key = getPaginationKey(section);
    if (!paginationConfig[key]) return;
    
    const config = paginationConfig[key];
    const start = (config.currentPage - 1) * config.pageSize;
    const end = start + config.pageSize;

    if (key === 'weapons') {
        const grid = document.querySelector('#weapons .weapon-grid');
        if (grid && weaponData) {
            let html = '';
            for (let i = start; i < end && i < weaponData.length; i++) {
                html += createWeaponCard(weaponData[i]);
            }
            grid.innerHTML = html;
        }
    } else if (key === 'enemies') {
        const grid = document.querySelector('#normal-enemies');
        if (grid && enemyData) {
            let html = '';
            const normalEnemies = enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通');
            for (let i = start; i < end && i < normalEnemies.length; i++) {
                html += createEnemyCard(normalEnemies[i]);
            }
            grid.innerHTML = html;
        }
    } else if (key === 'armors') {
        const grid = document.querySelector('#armor .weapon-grid');
        if (grid && armorData) {
            let html = '';
            for (let i = start; i < end && i < armorData.length; i++) {
                html += createArmorCard(armorData[i]);
            }
            grid.innerHTML = html;
        }
    } else if (key === 'consumables') {
        const consumablesTable = document.querySelector('#items .consumables-table');
        if (!consumablesTable) return;
        
        const tbody = consumablesTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? 'table-row' : 'none';
        });
        
        consumablesTable.style.display = 'table';
    } else if (key === 'materials') {
        const materialsTable = document.querySelector('#items .materials-table');
        if (!materialsTable) return;
        
        const tbody = materialsTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? 'table-row' : 'none';
        });
        
        materialsTable.style.display = 'table';
    }
}
