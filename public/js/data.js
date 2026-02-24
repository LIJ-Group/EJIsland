import { getElementKey } from './utils.js';

export const paginationConfig = {
    weapons: { pageSize: 8, currentPage: 1, totalItems: 38, items: null },
    enemies: { pageSize: 8, currentPage: 1, totalItems: 4, items: null },
    armors: { pageSize: 6, currentPage: 1, totalItems: 12, items: null },
    consumables: { pageSize: 10, currentPage: 1, totalItems: 0, items: null },
    materials: { pageSize: 10, currentPage: 1, totalItems: 0, items: null }
};

export let weaponData = [];
export let enemyData = [];
export let armorData = [];
export let itemData = {};
export let areaData = [];
export let elementData = [];
export let elementReactionData = [];
export let skillData = [];
export let questData = [];

const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithCache(url) {
    const cached = dataCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    dataCache.set(url, { data, timestamp: Date.now() });
    return data;
}

export const gameData = {
    version: '1.0.0',
    lastUpdate: '2026-02-22',
    get weapons() { return weaponData; },
    get enemies() { return enemyData; },
    get armors() { return armorData; },
    get items() { return itemData; },
    get areas() { return areaData; },
    get elements() { return elementData; },
    get elementReactions() { return elementReactionData; },
    get skills() { return skillData; },
    get quests() { return questData; },
    setWeapons: function(data) { weaponData = data; },
    setEnemies: function(data) { enemyData = data; },
    setArmors: function(data) { armorData = data; },
    setItems: function(data) { itemData = data; },
    setAreas: function(data) { areaData = data; },
    setElements: function(data) { elementData = data; },
    setElementReactions: function(data) { elementReactionData = data; },
    setSkills: function(data) { skillData = data; },
    setQuests: function(data) { questData = data; },
    getWeaponsByType: function(type) {
        return this.weapons.filter(w => w.type === type);
    },
    getWeaponsByElement: function(element) {
        return this.weapons.filter(w => w.element === element);
    },
    getWeaponsByRarity: function(rare) {
        return this.weapons.filter(w => w.rare === rare);
    },
    getEnemiesByArea: function(area) {
        return this.enemies.filter(e => e.area === area);
    },
    getEnemiesByType: function(type) {
        return this.enemies.filter(e => e.type === type);
    },
    getEnemiesByElement: function(element) {
        return this.enemies.filter(e => e.element === element);
    },
    getArmorsByType: function(type) {
        return this.armors.filter(a => a.type === type);
    },
    getArmorsByElement: function(element) {
        const key = getElementKey(element);
        return this.armors.filter(a => a.element === element || a[key] === '60%');
    },
    getItemsByCategory: function(category, type = 'consumables') {
        return this.items[type]?.filter(i => i.category === category) || [];
    },
    getElementReaction: function(elem1, elem2) {
        return this.elementReactions.find(r => 
            r.elements.includes(elem1) && r.elements.includes(elem2)
        );
    },
    getSkillsByType: function(type) {
        return this.skills.filter(s => s.type === type);
    }
};

export async function loadWeaponData() {
    try {
        const data = await fetchWithCache("public/data/weapons.json");
        gameData.setWeapons(data);
        paginationConfig.weapons.totalItems = data.length;
        return data;
    } catch (error) {
        console.error('加载武器数据失败:', error);
        return [];
    }
}

export async function loadArmorData() {
    try {
        const data = await fetchWithCache("public/data/armors.json");
        gameData.setArmors(data);
        paginationConfig.armors.totalItems = data.length;
        return data;
    } catch (error) {
        console.error('加载护甲数据失败:', error);
        return [];
    }
}

export async function loadEnemyData() {
    try {
        const data = await fetchWithCache("public/data/enemies.json");
        gameData.setEnemies(data);
        const normalEnemies = data.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通');
        paginationConfig.enemies.totalItems = normalEnemies.length;
        return data;
    } catch (error) {
        console.error('加载敌人数据失败:', error);
        return [];
    }
}

export async function loadItemData() {
    try {
        const data = await fetchWithCache("public/data/items.json");
        gameData.setItems(data);
        paginationConfig.consumables.totalItems = data.consumables?.length || 0;
        paginationConfig.materials.totalItems = data.materials?.length || 0;
        return data;
    } catch (error) {
        console.error('加载物品数据失败:', error);
        return {};
    }
}

export async function loadAreaData() {
    try {
        const data = await fetchWithCache("public/data/areas.json");
        gameData.setAreas(data);
        return data;
    } catch (error) {
        console.error('加载区域数据失败:', error);
        return [];
    }
}

export async function loadElementData() {
    try {
        const data = await fetchWithCache("public/data/elements.json");
        gameData.setElements(data);
        return data;
    } catch (error) {
        console.error('加载元素数据失败:', error);
        return [];
    }
}

export async function loadElementReactionData() {
    try {
        const data = await fetchWithCache("public/data/elementReactions.json");
        gameData.setElementReactions(data);
        return data;
    } catch (error) {
        console.error('加载元素反应数据失败:', error);
        return [];
    }
}

export async function loadSkillData() {
    try {
        const data = await fetchWithCache("public/data/skills.json");
        gameData.setSkills(data);
        return data;
    } catch (error) {
        console.error('加载技能数据失败:', error);
        return [];
    }
}

export async function loadQuestData() {
    try {
        const data = await fetchWithCache("public/data/quests.json");
        gameData.setQuests(data);
        return data;
    } catch (error) {
        console.error('加载任务数据失败:', error);
        return [];
    }
}

let dataLoaded = false;

export async function loadAllData() {
    if (dataLoaded) return;
    
    await Promise.all([
        loadWeaponData(),
        loadArmorData(),
        loadEnemyData(),
        loadItemData(),
        loadAreaData(),
        loadElementData(),
        loadElementReactionData(),
        loadSkillData(),
        loadQuestData()
    ]);
    
    dataLoaded = true;
}
