import { gameData, weaponData, armorData, enemyData } from './data.js';
import { toast } from './toast.js';

export function searchItems() {
    const searchInput = document.getElementById('itemSearch');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchResults) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        searchResults.innerHTML = '<p style="color: rgba(255, 248, 231, 0.5);">请输入搜索关键词</p>';
        return;
    }

    const items = document.querySelectorAll('.item-table tbody tr');
    let results = [];

    items.forEach(item => {
        const name = item.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        const effect = item.querySelector('td:last-child')?.textContent.toLowerCase() || '';

        if (name.includes(searchTerm) || effect.includes(searchTerm)) {
            results.push({
                name: item.querySelector('td:first-child')?.textContent || '',
                effect: item.querySelector('td:last-child')?.textContent || ''
            });
        }
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<p style="color: rgba(255, 248, 231, 0.5);">未找到匹配的物品</p>';
    } else {
        let html = '<h4 style="color: #D4AF37; margin-bottom: 10px;">搜索结果 (' + results.length + ')</h4>';
        html += '<table class="item-table">';
        html += '<tr><th>名称</th><th>效果/用途</th></tr>';
        results.forEach(item => {
            html += '<tr><td>' + item.name + '</td><td>' + item.effect + '</td></tr>';
        });
        html += '</table>';
        searchResults.innerHTML = html;
    }
}

export function globalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('globalSearchResults');
    if (!searchInput || !searchResults) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        searchResults.classList.remove('show');
        return;
    }

    let results = [];

    const sections = [
        { id: 'intro', title: '游戏简介', desc: '游戏的核心玩法和重要提示' },
        { id: 'areas', title: '区域介绍', desc: '异界之岛的各个区域和特色' },
        { id: 'echo-lands', title: '残响之地', desc: '特殊的维度区域' },
        { id: 'enemies', title: '敌人图鉴', desc: '游戏中各种敌人的信息和掉落' },
        { id: 'weapons', title: '武器系统', desc: '武器介绍、升级和获取途径' },
        { id: 'armor', title: '护甲系统', desc: '护甲介绍和属性' },
        { id: 'damage', title: '伤害计算', desc: '伤害计算公式和元素反应' },
        { id: 'element', title: '元素反应', desc: '元素反应和效果' },
        { id: 'skills', title: '技能系统', desc: '各种技能和效果' },
        { id: 'growth', title: '成长系统', desc: '升级、武器升级和玩家突破' },
        { id: 'items', title: '物品系统', desc: '消耗品、材料等物品信息' },
        { id: 'quests', title: '主线任务', desc: '主线任务和支线任务' },
        { id: 'tips', title: '新手指南', desc: '游戏中的实用技巧和建议' },
        { id: 'upload', title: '上传词条', desc: '提交新的词条内容' },
        { id: 'review', title: '审核词条', desc: '审核待处理的词条' }
    ];

    sections.forEach(section => {
        if (section.title.toLowerCase().includes(searchTerm) || section.desc.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'section',
                title: section.title,
                desc: section.desc,
                id: section.id
            });
        }
    });

    document.querySelectorAll('.area-card').forEach(card => {
        const title = card.querySelector('h4')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const stats = card.querySelector('.weapon-stats')?.textContent || '';
        if (title.toLowerCase().includes(searchTerm) || desc.toLowerCase().includes(searchTerm) || stats.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'area',
                title: '区域: ' + title,
                desc: desc.substring(0, 80) + (desc.length > 80 ? '...' : ''),
                id: 'areas'
            });
        }
    });

    weaponData.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm) || (item.element && item.element.toLowerCase().includes(searchTerm))) {
            results.push({
                type: 'weapon',
                title: '武器: ' + item.name,
                desc: item.desc.substring(0, 60) + (item.desc.length > 60 ? '...' : ''),
                id: 'weapons'
            });
        }
    });

    armorData.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'armor',
                title: '护甲: ' + item.name,
                desc: item.desc.substring(0, 60) + (item.desc.length > 60 ? '...' : ''),
                id: 'armor'
            });
        }
    });

    enemyData.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm) || (item.element && item.element.toLowerCase().includes(searchTerm))) {
            results.push({
                type: 'enemy',
                title: '敌人: ' + item.name,
                desc: item.desc.substring(0, 60) + (item.desc.length > 60 ? '...' : ''),
                id: 'enemies'
            });
        }
    });

    document.querySelectorAll('.skill-card').forEach(card => {
        const title = card.querySelector('h4')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const stats = card.querySelector('.weapon-stats')?.textContent || '';
        if (title.toLowerCase().includes(searchTerm) || desc.toLowerCase().includes(searchTerm) || stats.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'skill',
                title: '技能: ' + title,
                desc: desc.substring(0, 80) + (desc.length > 80 ? '...' : ''),
                id: 'skills'
            });
        }
    });

    document.querySelectorAll('.item-table tbody tr').forEach(item => {
        const name = item.querySelector('td:first-child')?.textContent || '';
        const effect = item.querySelector('td:last-child')?.textContent || '';
        const allText = item.textContent || '';
        if (allText.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'item',
                title: '物品: ' + name,
                desc: effect.substring(0, 80) + (effect.length > 80 ? '...' : ''),
                id: 'items'
            });
        }
    });

    document.querySelectorAll('section h2, section h3, section h4').forEach(heading => {
        const text = heading.textContent || '';
        if (text.toLowerCase().includes(searchTerm)) {
            const section = heading.closest('section');
            if (section && section.id) {
                const exists = results.some(r => r.title === text || r.title.includes(text));
                if (!exists) {
                    results.push({
                        type: 'heading',
                        title: '标题: ' + text,
                        desc: '',
                        id: section.id
                    });
                }
            }
        }
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="global-search-results-item"><div class="global-search-results-item-title">未找到匹配内容</div></div>';
    } else {
        let html = '';
        results.forEach(item => {
            html += '<div class="global-search-results-item" onclick="window.navigateToSection(\'' + item.id + '\')">';
            html += '<div class="global-search-results-item-title">' + item.title + '</div>';
            if (item.desc) {
                html += '<div class="global-search-results-item-desc">' + item.desc + '</div>';
            }
            html += '</div>';
        });
        searchResults.innerHTML = html;
    }

    searchResults.classList.add('show');
}

export function navigateToSection(sectionId) {
    const searchResults = document.getElementById('globalSearchResults');
    if (searchResults) searchResults.classList.remove('show');
    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) globalSearchInput.value = '';
    
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 40;
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            mainContent.style.transition = 'all 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
            mainContent.style.transform = 'scale(0.94)';
            mainContent.style.opacity = '0.85';
            mainContent.style.filter = 'blur(1px)';
            
            setTimeout(() => {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'auto'
                });
                
                requestAnimationFrame(() => {
                    mainContent.style.transform = 'scale(1)';
                    mainContent.style.opacity = '1';
                    mainContent.style.filter = 'blur(0px)';
                    
                    setTimeout(() => {
                        mainContent.style.transition = '';
                    }, 600);
                });
            }, 180);
        }
    }
}

let searchTimeout;

export function initSearchEventListeners() {
    const itemSearch = document.getElementById('itemSearch');
    if (itemSearch) {
        itemSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchItems();
            }
        });
    }

    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                globalSearch();
            }
        });

        globalSearchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const searchResults = document.getElementById('globalSearchResults');
            if (this.value.trim() === '') {
                if (searchResults) searchResults.classList.remove('show');
            } else {
                searchTimeout = setTimeout(() => {
                    globalSearch();
                }, 200);
            }
        });
    }

    document.addEventListener('click', function(e) {
        const searchResults = document.getElementById('globalSearchResults');
        const searchContainer = document.querySelector('.global-search');
        if (searchContainer && !searchContainer.contains(e.target)) {
            if (searchResults) searchResults.classList.remove('show');
        }
    });
}

window.searchItems = searchItems;
window.globalSearch = globalSearch;
window.navigateToSection = navigateToSection;

window.scrollToTopWithAnimation = function() {
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent) {
        mainContent.style.transition = 'all 0.45s cubic-bezier(0.32, 0.72, 0, 1)';
        mainContent.style.transform = 'scale(0.96)';
        mainContent.style.opacity = '0.8';
        mainContent.style.filter = 'blur(1.2px)';
        
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
            
            requestAnimationFrame(() => {
                mainContent.style.transform = 'scale(1)';
                mainContent.style.opacity = '1';
                mainContent.style.filter = 'blur(0px)';
                
                setTimeout(() => {
                    mainContent.style.transition = '';
                }, 550);
            });
        }, 160);
    }
};

window.submitUpload = function() {
    const uploadType = document.getElementById('uploadType');
    const uploadName = document.getElementById('uploadName');
    const uploadDesc = document.getElementById('uploadDesc');
    const uploadDetails = document.getElementById('uploadDetails');
    
    if (!uploadName.value.trim()) {
        toast.warning('请输入词条名称');
        return;
    }
    
    if (!uploadDesc.value.trim()) {
        toast.warning('请输入词条描述');
        return;
    }
    
    const uploadData = {
        type: uploadType.value,
        name: uploadName.value.trim(),
        desc: uploadDesc.value.trim(),
        details: uploadDetails.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    console.log('上传词条:', uploadData);
    toast.success('词条上传成功！等待审核');
    
    uploadName.value = '';
    uploadDesc.value = '';
    uploadDetails.value = '';
};
