import { handleResize } from './utils.js';
import { loadAllData, loadSectionData } from './data.js';
import { renderAreas, renderWeapons, renderArmors, renderBossEnemies, renderNormalEnemies, renderItems, renderDamage, renderElement, renderSkills, renderGrowth, renderQuests, renderTips, renderUpload, renderReview, renderBosses, renderTeleports, toggleCode } from './renderer.js';
import { initPagination, refreshAllPagination } from './pagination.js';
import { initSearchEventListeners } from './search.js';
import { initUI } from './ui.js';

window.toggleCode = toggleCode;

function checkAdminAccess() {
    const adminSection = document.getElementById('review');
    const adminLink = document.getElementById('reviewNavLink');
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true' || window.location.hash === '#admin';
    
    if (isAdmin) {
        if (adminSection) adminSection.style.display = 'block';
        if (adminLink) adminLink.style.display = 'inline-block';
    } else {
        if (adminSection) adminSection.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
    
    return isAdmin;
}

export const isAdmin = checkAdminAccess();
window.isAdmin = isAdmin;

const renderQueue = [];
let isRendering = false;

function scheduleRender(renderFn, priority = 0) {
    renderQueue.push({ fn: renderFn, priority });
    renderQueue.sort((a, b) => b.priority - a.priority);
    
    if (!isRendering) {
        requestAnimationFrame(processRenderQueue);
    }
}

function processRenderQueue() {
    isRendering = true;
    
    const batch = renderQueue.splice(0, 3);
    
    batch.forEach(item => {
        try {
            item.fn();
        } catch (e) {
            console.error('Render error:', e);
        }
    });
    
    if (renderQueue.length > 0) {
        requestAnimationFrame(processRenderQueue);
    } else {
        isRendering = false;
    }
}

async function initApp() {
    checkAdminAccess();
    
    try {
        await loadSectionData('areas');
        renderAreas();
        
        await Promise.all([
            loadSectionData('weapons'),
            loadSectionData('armors'),
            loadSectionData('items'),
            loadSectionData('enemies'),
            loadSectionData('bosses'),
            loadSectionData('teleports'),
            loadSectionData('elements'),
            loadSectionData('skills'),
            loadSectionData('quests')
        ]);
        
        renderWeapons();
        renderArmors();
        renderItems();
        renderBossEnemies();
        renderNormalEnemies();
        renderBosses();
        renderTeleports();
        
        initPagination();
        
        scheduleRender(renderDamage, 4);
        scheduleRender(renderElement, 3);
        scheduleRender(renderSkills, 2);
        scheduleRender(renderGrowth, 1);
        scheduleRender(renderQuests, 0);
        scheduleRender(renderBosses, 0);
        scheduleRender(renderTeleports, 0);
        scheduleRender(renderTips, 0);
        scheduleRender(renderUpload, 0);
        scheduleRender(renderReview, 0);
        
        requestAnimationFrame(() => {
            initSearchEventListeners();
            initUI();
        });
        
    } catch (error) {
        console.error('初始化应用失败:', error);
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

document.addEventListener('DOMContentLoaded', initApp);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered:', registration.scope);
            })
            .catch((error) => {
                console.log('SW registration failed:', error);
            });
    });
}

const sectionDataMap = {
    'areas': { dataName: 'areas', render: renderAreas, loaded: true },
    'echo-lands': { dataName: 'areas', render: renderAreas, loaded: true },
    'enemies': { dataName: 'enemies', render: () => { renderBossEnemies(); renderNormalEnemies(); }, loaded: false },
    'weapons': { dataName: 'weapons', render: renderWeapons, loaded: false },
    'armor': { dataName: 'armors', render: renderArmors, loaded: false },
    'items': { dataName: 'items', render: renderItems, loaded: false },
    'damage': { dataName: 'elements', render: renderDamage, loaded: false },
    'element': { dataName: 'elements', render: renderElement, loaded: false },
    'skills': { dataName: 'skills', render: renderSkills, loaded: false },
    'growth': { dataName: 'quests', render: renderGrowth, loaded: false },
    'quests': { dataName: 'quests', render: renderQuests, loaded: false },
    'bosses': { dataName: 'bosses', render: renderBosses, loaded: false },
    'teleports': { dataName: 'teleports', render: renderTeleports, loaded: false },
    'tips': { dataName: 'quests', render: renderTips, loaded: false },
    'upload': { dataName: 'quests', render: renderUpload, loaded: false },
    'review': { dataName: 'quests', render: renderReview, loaded: false }
};
