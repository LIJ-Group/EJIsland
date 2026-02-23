import { handleResize } from './utils.js';
import { loadAllData, weaponData, armorData, enemyData, areaData, itemData, elementData, elementReactionData, skillData } from './data.js';
import { renderAreas, renderWeapons, renderArmors, renderBossEnemies, renderNormalEnemies, renderItems, renderDamage, renderElement, renderSkills, renderGrowth, renderQuests, renderTips, renderUpload, renderReview, toggleCode } from './renderer.js';
import { initPagination } from './pagination.js';
import { initSearchEventListeners } from './search.js';
import { initUI } from './ui.js';

window.toggleCode = toggleCode;

function checkAdminAccess() {
    const adminSection = document.getElementById('review');
    const adminLink = document.querySelector('.sidebar-nav a[href="#review"]');
    
    if (window.location.hash === '#admin') {
        if (adminSection) {
            adminSection.style.display = 'block';
        }
        if (adminLink) {
            adminLink.style.display = 'inline-block';
        }
    } else {
        if (adminSection) {
            adminSection.style.display = 'none';
        }
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
}

async function initApp() {
    checkAdminAccess();
    await loadAllData();
    renderAreas();
    renderWeapons();
    renderArmors();
    renderBossEnemies();
    renderNormalEnemies();
    renderItems();
    renderDamage();
    renderElement();
    renderSkills();
    renderGrowth();
    renderQuests();
    renderTips();
    renderUpload();
    renderReview();
    initPagination();
    initSearchEventListeners();
    initUI();
    window.addEventListener('resize', handleResize);
    handleResize();
}

document.addEventListener('DOMContentLoaded', initApp);
