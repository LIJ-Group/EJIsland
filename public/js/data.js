import { getElementKey } from './utils.js';

export const paginationConfig = {
    weapons: { pageSize: 8, currentPage: 1, totalItems: 38, items: null },
    enemies: { pageSize: 4, currentPage: 1, totalItems: 4, items: null },
    armors: { pageSize: 6, currentPage: 1, totalItems: 10, items: null },
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
    setWeapons: function(data) { weaponData = data; },
    setEnemies: function(data) { enemyData = data; },
    setArmors: function(data) { armorData = data; },
    setItems: function(data) { itemData = data; },
    setAreas: function(data) { areaData = data; },
    setElements: function(data) { elementData = data; },
    setElementReactions: function(data) { elementReactionData = data; },
    setSkills: function(data) { skillData = data; },
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
    },
    exportJSON: function() {
        return JSON.stringify({
            version: this.version,
            lastUpdate: this.lastUpdate,
            weapons: this.weapons,
            enemies: this.enemies,
            armors: this.armors,
            items: this.items,
            areas: this.areas,
            elements: this.elements,
            elementReactions: this.elementReactions,
            skills: this.skills
        }, null, 2);
    }
};

export async function loadWeaponData() {
    try {
        const response = await fetch("public/data/weapons.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setWeapons(data);
            paginationConfig.weapons.totalItems = data.length;
            return data;
        } else {
            console.error('加载武器数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载武器数据失败:', error);
        return [];
    }
}

export async function loadArmorData() {
    try {
        const response = await fetch("public/data/armors.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setArmors(data);
            paginationConfig.armors.totalItems = data.length;
            return data;
        } else {
            console.error('加载护甲数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载护甲数据失败:', error);
        return [];
    }
}

export async function loadEnemyData() {
    try {
        const response = await fetch("public/data/enemies.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setEnemies(data);
            const normalEnemies = data.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通');
            paginationConfig.enemies.totalItems = normalEnemies.length;
            return data;
        } else {
            console.error('加载敌人数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载敌人数据失败:', error);
        return [];
    }
}

export async function loadItemData() {
    try {
        const response = await fetch("public/data/items.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setItems(data);
            paginationConfig.consumables.totalItems = data.consumables?.length || 0;
            paginationConfig.materials.totalItems = data.materials?.length || 0;
            return data;
        } else {
            console.error('加载物品数据失败:', response.status);
            return {};
        }
    } catch (error) {
        console.error('加载物品数据失败:', error);
        return {};
    }
}

export async function loadAreaData() {
    try {
        const response = await fetch("public/data/areas.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setAreas(data);
            return data;
        } else {
            console.error('加载区域数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载区域数据失败:', error);
        return [];
    }
}

export async function loadElementData() {
    try {
        const response = await fetch("public/data/elements.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setElements(data);
            return data;
        } else {
            console.error('加载元素数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载元素数据失败:', error);
        return [];
    }
}

export async function loadElementReactionData() {
    try {
        const response = await fetch("public/data/elementReactions.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setElementReactions(data);
            return data;
        } else {
            console.error('加载元素反应数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载元素反应数据失败:', error);
        return [];
    }
}

export async function loadSkillData() {
    try {
        const response = await fetch("public/data/skills.json");
        if (response.ok) {
            const data = await response.json();
            gameData.setSkills(data);
            return data;
        } else {
            console.error('加载技能数据失败:', response.status);
            return [];
        }
    } catch (error) {
        console.error('加载技能数据失败:', error);
        return [];
    }
}

export async function loadAllData() {
    await Promise.all([
        loadWeaponData(),
        loadArmorData(),
        loadEnemyData(),
        loadItemData(),
        loadAreaData(),
        loadElementData(),
        loadElementReactionData(),
        loadSkillData()
    ]);
}
