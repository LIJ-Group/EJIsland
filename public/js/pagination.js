import { paginationConfig, gameData, weaponData, armorData, enemyData, itemData } from './data.js';
import { createWeaponCard, createEnemyCard, createArmorCard } from './renderer.js';

export function initPagination() {
    paginationConfig.weapons.totalItems = weaponData.length;
    paginationConfig.enemies.totalItems = enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通').length;
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

export function renderPagination(section) {
    const config = paginationConfig[section];
    if (config.totalItems <= config.pageSize) return;

    let sectionId = section;
    if (section === 'weapons') sectionId = 'weapons';
    if (section === 'enemies') sectionId = 'enemies';
    if (section === 'armors') sectionId = 'armor';
    if (section === 'consumables' || section === 'materials') sectionId = 'items';

    let container = document.querySelector(`#${sectionId}`);
    if (!container) return;

    let existingPagination = container.querySelector(`.pagination[data-section="${section}"]`);
    if (existingPagination) {
        existingPagination.remove();
    }

    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    
    let html = `<div class="pagination" data-section="${section}">`;
    html += `<button class="pagination-btn prev-page" data-section="${section}" ${config.currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
    
    const maxButtons = 5;
    let startPage = Math.max(1, config.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn page-number ${i === config.currentPage ? 'active' : ''}" data-section="${section}" data-page="${i}">${i}</button>`;
    }
    
    html += `<span class="pagination-info">${config.currentPage}/${totalPages}页</span>`;
    html += `<button class="pagination-btn next-page" data-section="${section}" ${config.currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
    html += '</div>';

    if (section === 'consumables') {
        const consumablesContainer = container.querySelector('.consumables-table');
        if (consumablesContainer) {
            consumablesContainer.insertAdjacentHTML('afterend', html);
        }
    } else if (section === 'materials') {
        const materialsContainer = container.querySelector('.materials-table');
        if (materialsContainer) {
            materialsContainer.insertAdjacentHTML('afterend', html);
        }
    } else {
        container.insertAdjacentHTML('beforeend', html);
    }

    const paginationContainer = container.querySelector(`.pagination[data-section="${section}"]`);
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
    const config = paginationConfig[section];
    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    const newPage = config.currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        config.currentPage = newPage;
        renderPagination(section);
        applyPagination(section);
    }
}

export function goToPage(section, page) {
    const config = paginationConfig[section];
    const totalPages = Math.ceil(config.totalItems / config.pageSize);
    
    if (page >= 1 && page <= totalPages) {
        config.currentPage = page;
        renderPagination(section);
        applyPagination(section);
    }
}

export function applyPagination(section) {
    const config = paginationConfig[section];
    const start = (config.currentPage - 1) * config.pageSize;
    const end = start + config.pageSize;

    if (section === 'weapons') {
        const grid = document.querySelector('#weapons .weapon-grid');
        if (grid && weaponData) {
            let html = '';
            for (let i = start; i < end && i < weaponData.length; i++) {
                html += createWeaponCard(weaponData[i]);
            }
            grid.innerHTML = html;
        }
    } else if (section === 'enemies') {
        const grid = document.querySelector('#enemies .enemy-grid');
        if (grid && enemyData) {
            let html = '';
            const normalEnemies = enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通');
            for (let i = start; i < end && i < normalEnemies.length; i++) {
                html += createEnemyCard(normalEnemies[i]);
            }
            grid.innerHTML = html;
        }
    } else if (section === 'armors') {
        const grid = document.querySelector('#armor .weapon-grid');
        if (grid && armorData) {
            let html = '';
            for (let i = start; i < end && i < armorData.length; i++) {
                html += createArmorCard(armorData[i]);
            }
            grid.innerHTML = html;
        }
    } else if (section === 'consumables') {
        const consumablesTable = document.querySelector('#items .consumables-table');
        if (!consumablesTable) return;
        
        const tbody = consumablesTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? 'table-row' : 'none';
        });
        
        consumablesTable.style.display = 'table';
    } else if (section === 'materials') {
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


