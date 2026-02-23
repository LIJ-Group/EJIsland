import { handleResize } from './utils.js';
import { loadAllData, weaponData, armorData, enemyData, areaData, itemData, elementData, elementReactionData, skillData } from './data.js';
import { renderAreas, renderWeapons, renderArmors, renderBossEnemies, renderNormalEnemies, renderItems, renderDamage, renderElement, renderSkills, renderGrowth, renderQuests, renderTips, renderUpload, renderReview, toggleCode } from './renderer.js';
import { initPagination } from './pagination.js';
import { initSearchEventListeners } from './search.js';
import { initUI } from './ui.js';

window.toggleCode = toggleCode;

function checkAdminAccess() {
    const adminSection = document.getElementById('review');
    const adminLink = document.getElementById('reviewNavLink');
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true' || window.location.hash === '#admin';
    
    if (isAdmin) {
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
    
    return isAdmin;
}

export const isAdmin = checkAdminAccess();
window.isAdmin = isAdmin;

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
