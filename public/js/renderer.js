import { escapeHtml } from './utils.js';
import { gameData, weaponData, armorData, enemyData, areaData, itemData, elementData, elementReactionData, skillData, questData } from './data.js';
import { toast } from './toast.js';

export function createWeaponCard(item) {
    let html = `<div class="weapon-card"><h4>${item.name}</h4><p>${item.desc}</p><div class="weapon-stats">`;
    html += `<p><strong>类型：</strong>${item.type}</p>`;
    if (item.rare) html += `<p><strong>稀有度：</strong>${item.rare}</p>`;
    if (item.damage) html += `<p><strong>伤害公式：</strong>${item.damage}</p>`;
    if (item.get) html += `<p><strong>获取途径：</strong>${item.get}</p>`;
    if (item.element) html += `<p><strong>元素类型：</strong>${item.element}</p>`;
    html += `</div>`;
    
    if (item.serverCode) {
        const codeId = `code-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const escapedCode = escapeHtml(item.serverCode);
        html += `<div class="weapon-code-section">`;
        html += `<div class="weapon-code-toggle" onclick="toggleCode('${codeId}', this)">`;
        html += `<span class="toggle-text">📜 <span class="toggle-label">查看服务器代码</span></span>`;
        html += `<span class="toggle-icon">▼</span>`;
        html += `</div>`;
        html += `<div class="weapon-code-content" id="${codeId}">`;
        html += `<div class="weapon-code"><pre>${escapedCode}</pre></div>`;
        html += `</div>`;
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

export function toggleCode(codeId, toggle) {
    if (!window.isAdmin) {
        toast.warning('权限不足，无法查看服务器代码');
        return;
    }
    const content = document.getElementById(codeId);
    if (!content) {
        console.error('Code content not found:', codeId);
        return;
    }
    const label = toggle.querySelector('.toggle-label');
    const icon = toggle.querySelector('.toggle-icon');
    const isActive = content.classList.toggle('active');
    toggle.classList.toggle('active', isActive);
    if (label) {
        label.textContent = isActive ? '收起代码' : '查看服务器代码';
    }
    if (icon) {
        icon.textContent = isActive ? '▲' : '▼';
    }
}

export function createArmorCard(item) {
    let html = `<div class="weapon-card"><h4>${item.name}</h4><p>${item.desc}</p><div class="weapon-stats">`;
    html += `<p><strong>类型：</strong>${item.type}</p>`;
    if (item.durability) html += `<p><strong>耐久度：</strong>${item.durability}</p>`;
    if (item.physical) html += `<p><strong>物理防御：</strong>${item.physical}</p>`;
    if (item.element) html += `<p><strong>元素防御：</strong>${item.element}</p>`;
    if (item.ice) html += `<p><strong>冰系防御：</strong>${item.ice}</p>`;
    if (item.fire) html += `<p><strong>火系防御：</strong>${item.fire}</p>`;
    if (item.earth) html += `<p><strong>岩系防御：</strong>${item.earth}</p>`;
    if (item.grass) html += `<p><strong>草系防御：</strong>${item.grass}</p>`;
    if (item.water) html += `<p><strong>水系防御：</strong>${item.water}</p>`;
    if (item.other) html += `<p><strong>其他元素防御：</strong>${item.other}</p>`;
    if (item.set) html += `<p><strong>套装组成：</strong>${item.set}</p>`;
    if (item.skill) html += `<p><strong>攻击方式：</strong>${item.skill}</p>`;
    if (item.cd) html += `<p><strong>冷却时间：</strong>${item.cd}</p>`;
    html += `</div></div>`;
    return html;
}

export function renderAreas() {
    const areaGrid = document.getElementById('area-grid');
    if (!areaGrid) return;

    let html = '';
    areaData.forEach(area => {
        let featuresHtml = '';
        if (area.features) {
            featuresHtml = area.features.map(f => `<span class="feature-tag">${f}</span>`).join('');
        }
        let hazardsHtml = '';
        if (area.hazards) {
            hazardsHtml = `<p><strong>危险：</strong>${area.hazards.join('、')}</p>`;
        }
        let tipsHtml = '';
        if (area.tips) {
            tipsHtml = `<p><strong>提示：</strong>${area.tips.join('；')}</p>`;
        }
        html += `
            <div class="area-card">
                <h4>${area.name}</h4>
                <p class="level">${area.type} | ${area.level}</p>
                <p>${area.desc}</p>
                ${area.music ? `<p><strong>背景音乐：</strong>${area.music}</p>` : ''}
                ${featuresHtml ? `<div class="features">${featuresHtml}</div>` : ''}
                ${hazardsHtml}
                ${tipsHtml}
                ${area.boss ? `<p><strong>Boss：</strong>${area.boss}</p>` : ''}
                ${area.drops ? `<p><strong>主要掉落：</strong>${area.drops.join('、')}</p>` : ''}
            </div>
        `;
    });

    areaGrid.innerHTML = html;
}

export function renderBossEnemies() {
    const bossGrid = document.getElementById('boss-enemies');
    if (!bossGrid) return;
    
    const bossEnemies = enemyData.filter(enemy => enemy.boss || enemy.elite);
    
    let html = '';
    bossEnemies.forEach(enemy => {
        html += `
            <div class="enemy-card">
                <h4>${enemy.name}</h4>
                <p class="hp">生命值：${enemy.hp}</p>
                <div class="weapon-stats">
                    <p><strong>出现区域：</strong>${enemy.area}</p>
                    ${enemy.levelFormula ? `<p><strong>等级计算：</strong>${enemy.levelFormula}</p>` : '<p><strong>等级范围：</strong>随区域变化</p>'}
                    ${enemy.hpFormula ? `<p><strong>生命值公式：</strong>${enemy.hpFormula}</p>` : ''}
                    <p><strong>攻击方式：</strong>${enemy.attackMethods ? enemy.attackMethods.join('、') : enemy.skills.join('、')}</p>
                    <p><strong>特殊技能：</strong></p>
                    <ul>
                        ${enemy.detailedSkills ? enemy.detailedSkills.map(skill => `<li>${skill}</li>`).join('') : enemy.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                    ${enemy.battleMechanics ? `<p><strong>战斗机制：</strong></p><ul>${enemy.battleMechanics.map(mechanic => `<li>${mechanic}</li>`).join('')}</ul>` : ''}
                    <p><strong>元素属性：</strong>${enemy.element}</p>
                    ${enemy.refreshConditions ? `<p><strong>刷新条件：</strong></p><ul>${enemy.refreshConditions.map(condition => `<li>${condition}</li>`).join('')}</ul>` : ''}
                    ${enemy.refreshCooldown ? `<p><strong>刷新冷却：</strong>${enemy.refreshCooldown}</p>` : ''}
                    <p><strong>掉落物品：</strong></p>
                    <ul>
                        ${enemy.dropDetails ? enemy.dropDetails.map(drop => `<li>${drop}</li>`).join('') : `<li>${enemy.drop}</li>`}
                    </ul>
                </div>
            </div>
        `;
    });
    
    bossGrid.innerHTML = html;
}

export function renderNormalEnemies() {
    const enemySection = document.querySelector('#enemies');
    if (!enemySection) return;

    const normalEnemies = enemyData.filter(enemy => !enemy.boss && !enemy.elite && enemy.type === '普通');

    const normalEnemyGridHTML = `
        <div class="enemy-grid" id="normal-enemies">
            ${normalEnemies.map(enemy => `
                <div class="enemy-card">
                    <h4>${enemy.name}</h4>
                    <p class="hp">生命值：${enemy.hp}</p>
                    <p>${enemy.desc || ''}</p>
                    <div class="weapon-stats">
                        <p><strong>出现区域：</strong>${enemy.area}</p>
                        ${enemy.hpFormula ? `<p><strong>生命值公式：</strong>${enemy.hpFormula}</p>` : ''}
                        ${enemy.skills ? `<p><strong>攻击方式：</strong>${enemy.skills.join('、')}</p>` : ''}
                        ${enemy.element ? `<p><strong>元素属性：</strong>${enemy.element}</p>` : ''}
                        <p><strong>掉落物品：</strong></p>
                        <ul>
                            ${enemy.dropDetails ? enemy.dropDetails.map(drop => `<li>${drop}</li>`).join('') : enemy.drop ? `<li>${enemy.drop}</li>` : '<li>无</li>'}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const existingGrid = enemySection.querySelector('#normal-enemies');
    if (existingGrid) existingGrid.remove();

    const h3Normal = enemySection.querySelector('h3:nth-of-type(1)');
    if (h3Normal && h3Normal.textContent === '普通敌人') {
        h3Normal.insertAdjacentHTML('afterend', normalEnemyGridHTML);
    }
}

export function createEnemyCard(enemy) {
    return `
        <div class="enemy-card">
            <h4>${enemy.name}</h4>
            <p class="hp">生命值：${enemy.hp}</p>
            <p>${enemy.desc || ''}</p>
            <div class="weapon-stats">
                <p><strong>出现区域：</strong>${enemy.area}</p>
                ${enemy.hpFormula ? `<p><strong>生命值公式：</strong>${enemy.hpFormula}</p>` : ''}
                ${enemy.skills ? `<p><strong>攻击方式：</strong>${enemy.skills.join('、')}</p>` : ''}
                ${enemy.element ? `<p><strong>元素属性：</strong>${enemy.element}</p>` : ''}
                <p><strong>掉落物品：</strong></p>
                <ul>
                    ${enemy.dropDetails ? enemy.dropDetails.map(drop => `<li>${drop}</li>`).join('') : enemy.drop ? `<li>${enemy.drop}</li>` : '<li>无</li>'}
                </ul>
            </div>
        </div>
    `;
}

export function renderWeapons() {
    const weaponGrid = document.querySelector('#weapons .weapon-grid');
    if (!weaponGrid) return;

    let html = '';
    weaponData.forEach(weapon => {
        html += `
            <div class="weapon-card">
                <h4>${weapon.name}</h4>
                <p>${weapon.desc || ''}</p>
                <div class="weapon-stats">
                    <p><strong>类型：</strong>${weapon.type}</p>
                    ${weapon.get ? `<p><strong>获取途径：</strong>${weapon.get}</p>` : ''}
                    <p><strong>稀有度：</strong>${weapon.rarity || '★'}</p>
                    ${weapon.damage ? `<p><strong>伤害公式：</strong>${weapon.damage}</p>` : ''}
                    ${weapon.element ? `<p><strong>元素类型：</strong>${weapon.element}</p>` : ''}
                </div>
            </div>
        `;
    });

    weaponGrid.innerHTML = html;
}

export function renderArmors() {
    let armorGrid = document.querySelector('#armor .weapon-grid');
    if (!armorGrid) {
        armorGrid = document.getElementById('armor-grid');
    }
    if (!armorGrid) return;

    let html = '';
    armorData.forEach(armor => {
        let defHtml = '';
        if (armor.def) {
            Object.entries(armor.def).forEach(([key, value]) => {
                defHtml += `<p><strong>${key}抗性：</strong>${value}</p>`;
            });
        }
        html += `
            <div class="weapon-card">
                <h4>${armor.name} <span class="rarity">${armor.rarity || ''}</span></h4>
                <p>${armor.desc || ''}</p>
                <div class="weapon-stats">
                    <p><strong>类型：</strong>${armor.type}</p>
                    ${armor.durability ? `<p><strong>耐久度：</strong>${armor.durability}</p>` : '<p><strong>耐久度：</strong>无消耗</p>'}
                    ${defHtml}
                    ${armor.skill ? `<p><strong>技能：</strong>${armor.skill}</p>` : ''}
                    ${armor.get ? `<p><strong>获取方式：</strong>${armor.get}</p>` : ''}
                </div>
            </div>
        `;
    });

    armorGrid.innerHTML = html;
}

export function renderItems() {
    const itemsSection = document.getElementById('items');
    if (!itemsSection) return;

    const consumables = itemData.consumables || [];
    const materials = itemData.materials || [];

    if (consumables.length > 0) {
        const consumablesHTML = `
            <h3>消耗品</h3>
            <div class="item-category">
                <table class="item-table consumables-table">
                    <thead>
                        <tr><th>名称</th><th>效果</th><th>类别</th><th>稀有度</th><th>价格</th><th>获取方式</th><th>堆叠</th><th>冷却</th></tr>
                    </thead>
                    <tbody>
                        ${consumables.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.effect || ''}</td>
                                <td>${item.category || ''}</td>
                                <td>${item.rarity || ''}</td>
                                <td>${item.price || ''}</td>
                                <td>${item.obtain || ''}</td>
                                <td>${item.stack || ''}</td>
                                <td>${item.cooldown || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        itemsSection.insertAdjacentHTML('beforeend', consumablesHTML);
    }

    if (materials.length > 0) {
        const materialsHTML = `
            <h3>材料</h3>
            <div class="item-category">
                <table class="item-table materials-table">
                    <thead>
                        <tr><th>名称</th><th>用途</th><th>类别</th><th>稀有度</th><th>来源</th></tr>
                    </thead>
                    <tbody>
                        ${materials.map(item => `
                            <tr>
                                <td>${item.name || ''}</td>
                                <td>${item.usage || ''}</td>
                                <td>${item.category || ''}</td>
                                <td>${item.rarity || ''}</td>
                                <td>${item.source || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        itemsSection.insertAdjacentHTML('beforeend', materialsHTML);
    }
}

export function renderDamage() {
    const damageContent = document.getElementById('damage-content');
    if (!damageContent) return;

    const damageCodeId = 'damage-code-' + Date.now();
    const damageHTML = `
        <div class="info-box">
            <h3>伤害类型</h3>
            <ul>
                <li><strong>0：物理伤害</strong></li>
                <li><strong>1：冰</strong></li>
                <li><strong>2：火</strong></li>
                <li><strong>3：电</strong></li>
                <li><strong>4：风</strong></li>
                <li><strong>5：生命</strong></li>
                <li><strong>6：大地</strong></li>
                <li><strong>7：水</strong></li>
                <li><strong>8：空间</strong></li>
                <li><strong>9：光明</strong></li>
                <li><strong>10：黑暗</strong></li>
                <li><strong>11：时间</strong></li>
                <li><strong>12：摔落伤害</strong></li>
            </ul>
        </div>
        <div class="info-box">
            <h3>伤害计算公式</h3>
            <div class="formula-box">
                <div class="formula-title">1. 防御力减免</div>
                <div class="formula-content">
                    <p class="formula">scale = this.def[type] 或 1（默认值）</p>
                    <p class="formula">若为物理伤害且有超导效果：scale += 0.2</p>
                    <p class="formula">若有对应元素抗性减免：scale += this.effect[type + 9].params.power</p>
                    <p class="formula">伤害 = 伤害 × scale</p>
                </div>
            </div>
            <div class="formula-box">
                <div class="formula-title">2. 玩家间伤害衰减</div>
                <div class="formula-content">
                    <p class="formula">若攻击者和受击者都是玩家：</p>
                    <p class="formula">伤害 = 0.05 × 伤害 + 30 × ln(0.1 × 伤害 + 1)</p>
                </div>
            </div>
            <div class="formula-box">
                <div class="formula-title">3. 元素反应</div>
                <div class="formula-content">
                    <p class="formula">伤害 = 伤害 × elementEffect(this, type, power, 伤害, attacker)</p>
                </div>
            </div>
            <div class="formula-box">
                <div class="formula-title">4. 护盾吸收</div>
                <div class="formula-content">
                    <p class="formula">reduction = max(所有护盾的hp)</p>
                    <p class="formula">伤害 = 伤害 - min(伤害, reduction)</p>
                </div>
            </div>
            <div class="formula-box">
                <div class="formula-title">5. 暴击计算</div>
                <div class="formula-content">
                    <p class="formula">暴击率 = 0（基础值）</p>
                    <p class="formula">若有装备75（暴击头）：暴击率 += 0.3</p>
                    <p class="formula">若敌人被冻结且攻击者有冰甲：暴击率 += 0.2</p>
                    <p class="formula">暴击率 += getCritRate(attacker)</p>
                    <p class="formula">暴击伤害 = 1.5 + getCritDMG(attacker)</p>
                    <p class="formula">若有装备77（暴击头）：伤害 ×= 1.1</p>
                    <p class="formula">若随机数 < 暴击率：伤害 ×= 暴击伤害</p>
                </div>
            </div>
        </div>
        <div class="info-box">
            <h3>GameEntity.prototype.damage 源代码</h3>
            <div class="weapon-code-section">
                <div class="weapon-code-toggle" onclick="toggleCode('${damageCodeId}', this)">
                    <span class="toggle-text">📜 <span class="toggle-label">查看服务器代码</span></span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="weapon-code-content" id="${damageCodeId}">
                    <div class="weapon-code"><pre>GameEntity.prototype.damage = function(hp, attacker, type, power = 5 /* 元素攻击强度 */) {
    /*
    伤害类型：
    0：物理伤害
    1：冰
    2：火
    3：电
    4：风
    5：生命
    6：大地
    7：水
    8：空间
    9：光明
    10：黑暗
    11：时间
    12：摔落伤害
    */
    if (attacker && shieldBlock(this, attacker)) {
        return;
    }
    if (this.def) {
        let scale = (this.def[type] || this.def[type] === 0) ? this.def[type] : 1;
        if (!type && this.effect[8]) {
            scale += 0.2;
        }
        if (RESREDUCING.includes(type) && this.effect[type + 9]) {
            scale += this.effect[type + 9].params.power;
        }
        hp *= scale;
    }
    if (this.isPlayer && attacker && attacker.isPlayer) {
        hp = 0.05 * hp + 30 * Math.log(0.1 * hp + 1);
    }
    hp *= elementEffect(this, type, power, hp, attacker);
    if (type !== 12 && this.shields) {
        let reduction = 0;
        for (const e of this.shields) {
            reduction = Math.max(e.hp, reduction);
            CMD.crackShield(this, e, hp);
        }
        hp -= Math.min(hp, reduction);
    }
    if (hp > 0) {
        if (this.skills) {
            for (const e of this.skills) {
                if (Skill[e.id].takeDamage) {
                    Skill[e.id].takeDamage({entity: this, level: e.level, dmg: hp, attacker});
                }
            }
        }
        let critRate = 0;
        let critDMG = 1.5;
        if (attacker) {
            if (getEquip(attacker, 75)) {
                critRate += 0.3;
            }
            if (isFrozen(this) && icyArmor(attacker)) {
                critRate += 0.2;
            }
            if (getEquip(attacker, 77)) {
                hp *= 1.1;
            }
            critRate += getCritRate(attacker);
            critDMG += getCritDMG(attacker);
        }
        if (Math.random() < critRate) {
            hp *= critDMG;
        }
        this.hurt(hp, {attacker});
    }
    if (this && this.isPlayer && type != 12) {
        crackEquip(this);
    }
    if (attacker && attacker.isPlayer) {
        crackWeapon(attacker);
    }
    return true;
}</pre></div>
                </div>
            </div>
        </div>
        <div class="info-box">
            <h3>伤害处理流程</h3>
            <ol>
                <li><strong>护盾检查</strong>：首先检查是否有护盾阻止伤害</li>
                <li><strong>防御力减免</strong>：根据目标的防御属性计算伤害减免</li>
                <li><strong>玩家间伤害衰减</strong>：玩家对玩家造成的伤害会被衰减</li>
                <li><strong>元素反应</strong>：调用 elementEffect 函数处理元素反应</li>
                <li><strong>护盾吸收</strong>：护盾会吸收部分伤害</li>
                <li><strong>技能触发</strong>：触发受击者的相关技能</li>
                <li><strong>暴击计算</strong>：计算暴击率和暴击伤害</li>
                <li><strong>造成伤害</strong>：调用 hurt 函数实际造成伤害</li>
                <li><strong>技能触发</strong>：触发受击者的相关技能</li>
            </ol>
        </div>
    `;
    damageContent.innerHTML = damageHTML;
}

export function renderQuests() {
    const questsContent = document.getElementById('quests-content');
    if (!questsContent) return;

    let html = '';
    questData.forEach(quest => {
        html += `
            <div class="quest-card">
                <h4>${quest.name}</h4>
                <p class="quest-type">${quest.type} | ${quest.status}</p>
                <div class="quest-steps">
                    <h5>任务步骤：</h5>
                    <ol>
                        ${quest.steps.map(step => `
                            <li class="step-${step.type.toLowerCase()}">
                                <span class="step-type">[${step.type}]</span>
                                ${step.description}
                                ${step.target ? `<span class="step-target">目标：${step.target}${step.count ? ` x${step.count}` : ''}</span>` : ''}
                            </li>
                        `).join('')}
                    </ol>
                </div>
                ${quest.rewards ? `<p><strong>奖励：</strong>${quest.rewards.join('、')}</p>` : ''}
                ${quest.unlocks && quest.unlocks.length > 0 ? `<p><strong>解锁：</strong>${quest.unlocks.join('、')}</p>` : ''}
            </div>
        `;
    });

    questsContent.innerHTML = html;
}

export function renderSkills() {
    const skillsContent = document.getElementById('skills-content');
    if (!skillsContent) return;

    let html = '';
    skillData.forEach(skill => {
        html += `
            <div class="skill-card">
                <h4>${skill.name}</h4>
                <p class="skill-type">${skill.type} | 最高等级：${skill.maxLevel}</p>
                <p>${skill.description}</p>
                ${skill.costFormula ? `<p><strong>升级费用公式：</strong>${skill.costFormula}</p>` : ''}
                <div class="skill-levels">
                    <h5>等级详情：</h5>
                    <table class="skill-table">
                        <thead>
                            <tr><th>等级</th><th>效果</th><th>费用</th></tr>
                        </thead>
                        <tbody>
                            ${skill.levels.map(level => `
                                <tr>
                                    <td>Lv.${level.level}</td>
                                    <td>${level.value}</td>
                                    <td>${level.cost}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${skill.tips ? `<p><strong>提示：</strong>${skill.tips.join('；')}</p>` : ''}
            </div>
        `;
    });

    skillsContent.innerHTML = html;
}

export function renderTips() {
    const tipsContent = document.getElementById('tips-content');
    if (!tipsContent) return;

    const tipsHTML = `
        <div class="info-box">
            <h3>新手入门</h3>
            <ul>
                <li><strong>第一步：</strong>在夜明镇与NPC对话，了解游戏基本操作</li>
                <li><strong>购买装备：</strong>在道具店购买初始武器和护甲</li>
                <li><strong>准备食物：</strong>在餐饮店购买回复道具</li>
                <li><strong>解锁传送：</strong>探索各个区域时记得激活传送锚点</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>战斗技巧</h3>
            <ul>
                <li><strong>元素反应：</strong>利用元素反应可以造成更高伤害</li>
                <li><strong>躲避攻击：</strong>注意敌人的攻击前摇，及时躲避</li>
                <li><strong>合理使用食物：</strong>战斗前使用增益食物可以大幅提升战斗力</li>
                <li><strong>护盾技能：</strong>学习寂无之盾可以在受到伤害时生成护盾</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>生存指南</h3>
            <ul>
                <li><strong>寒冷区域：</strong>在至北雪山注意寒冷值，及时使用保暖道具</li>
                <li><strong>Boss战：</strong>Boss战前准备好足够的回复道具和增益食物</li>
                <li><strong>装备耐久：</strong>注意装备耐久度，及时修复或更换</li>
                <li><strong>等级突破：</strong>达到等级上限后需要完成突破任务才能继续升级</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>资源获取</h3>
            <ul>
                <li><strong>曙光灵石：</strong>主要货币，通过击败敌人和完成任务获得</li>
                <li><strong>技能点：</strong>用于升级技能，击败敌人和开宝箱获得</li>
                <li><strong>材料：</strong>击败对应元素的敌人获得相应材料</li>
                <li><strong>残响之地：</strong>高风险高回报的区域，可以获得稀有装备</li>
            </ul>
        </div>
        <div class="warning-box">
            <h3>注意事项</h3>
            <ul>
                <li>死亡会损失部分物品，请谨慎冒险</li>
                <li>残响之地是PVP区域，小心其他玩家</li>
                <li>部分武器有特殊攻击方式，按住蹲下键可以释放技能</li>
                <li>水下战斗与陆地战斗机制不同，部分武器在水下有特殊效果</li>
            </ul>
        </div>
    `;
    tipsContent.innerHTML = tipsHTML;
}

export function renderGrowth() {
    const growthContent = document.getElementById('growth-content');
    if (!growthContent) return;

    const growthHTML = `
        <div class="info-box">
            <h3>等级系统</h3>
            <p>通过击败敌人和完成任务获得经验值，提升等级可以增加基础属性。</p>
            <ul>
                <li><strong>初始等级上限：</strong>75级</li>
                <li><strong>等级突破：</strong>达到等级上限后需要完成突破任务才能继续升级</li>
                <li><strong>武器等级限制：</strong>可使用武器等级上限 = min(玩家等级上限 + 5, 90)</li>
            </ul>
            <p><strong>武器等级分段：</strong></p>
            <ul>
                <li><strong>玩家等级 + 10：</strong>玩家等级 < 30 级</li>
                <li><strong>玩家等级 + 5：</strong>玩家等级 >= 30 级</li>
                <li><strong>最高等级：</strong>武器等级上限</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>技能系统</h3>
            <p>使用技能点可以学习和升级技能，提升战斗能力。</p>
            <ul>
                <li><strong>寂无之盾：</strong>防御技能，受到伤害时生成护盾</li>
                <li><strong>自然法术：</strong>攻击技能，提升所有攻击力</li>
                <li><strong>野人进击：</strong>攻击技能，提升近战攻击力</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>武器升级</h3>
            <p>部分武器可以通过消耗材料进行升级，提升武器伤害和效果。</p>
            <table class="growth-table">
                <thead>
                    <tr><th>武器名称</th><th>解锁等级</th><th>升级材料</th><th>升级费用公式</th></tr>
                </thead>
                <tbody>
                    <tr><td>白银长枪</td><td>1级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>机械弩</td><td>1级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>虚空之枪</td><td>30级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>冰系法杖</td><td>20级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>岩刀</td><td>20级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>岩枪</td><td>20级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>炎刀</td><td>20级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>狂涛之弓</td><td>30级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>飓风之杖</td><td>30级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>净水之刃</td><td>30级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>爆炎之杖</td><td>30级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>苍穹之上的星辰三叉戟</td><td>90级</td><td>机械碎片</td><td>375 + 当前等级 × 150</td></tr>
                    <tr><td>剧毒螳螂刀</td><td>60级</td><td>曙光灵石</td><td>300 + 当前等级 × 40</td></tr>
                    <tr><td>闪电螳螂刀</td><td>90级</td><td>曙光灵石</td><td>200 + 当前等级 × 25</td></tr>
                    <tr><td>骑士大剑</td><td colspan="3">暂未录入</td></tr>
                    <tr><td>渊界撕裂者</td><td colspan="3">暂未录入</td></tr>
                </tbody>
            </table>
        </div>
        <div class="info-box">
            <h3>装备耐久</h3>
            <p>武器和护甲都有耐久度，使用和战斗会消耗耐久。</p>
            <ul>
                <li><strong>修复材料：</strong>使用铜矿（100耐久）或铁矿（500耐久）修复装备</li>
                <li><strong>耐久归零：</strong>装备耐久归零后无法使用，但不会消失</li>
            </ul>
        </div>
    `;
    growthContent.innerHTML = growthHTML;
}

export function renderElement() {
    const elementContent = document.getElementById('element-content');
    if (!elementContent) return;

    let elementGridHTML = `
        <h3>元素类型</h3>
        <div class="element-grid">
    `;

    elementData.forEach(element => {
        const elementClass = element.name === '火' ? 'element-fire' :
                            element.name === '冰' ? 'element-ice' :
                            element.name === '雷' ? 'element-thunder' :
                            element.name === '岩' ? 'element-earth' :
                            element.name === '风' ? 'element-wind' :
                            element.name === '水' ? 'element-water' :
                            element.name === '草' ? 'element-grass' :
                            element.name === '毒' ? 'element-poison' : '';

        elementGridHTML += `
            <div class="element-item">
                <div class="element-icon ${elementClass}">${element.icon}</div>
                <h4>${element.name}</h4>
                <p>${element.desc}</p>
            </div>
        `;
    });

    elementGridHTML += `
        </div>

        <h3>基础元素反应效果及倍率</h3>
        <div class="table-wrapper">
            <table class="item-table">
            <thead>
                <tr>
                    <th>元素组合</th>
                    <th>反应名称</th>
                    <th>反应倍率</th>
                    <th>效果</th>
                    <th>持续时间</th>
                </tr>
            </thead>
            <tbody>
    `;

    elementReactionData.forEach(reaction => {
        elementGridHTML += `
                <tr>
                    <td>${reaction.elements.join(' + ')}</td>
                    <td>${reaction.name}</td>
                    <td>${reaction.multiplier}</td>
                    <td>${reaction.effect}</td>
                    <td>${reaction.duration}</td>
                </tr>
        `;
    });

    elementGridHTML += `
            </tbody>
        </table>
        </div>

        <div class="tip-box">
            <h3>元素反应技巧</h3>
            <ul>
                <li><strong>先附着后触发</strong>：先用弱元素附着，再用强元素触发，伤害更高</li>
                <li><strong>注意元素顺序</strong>：不同的触发顺序可能影响反应类型和伤害</li>
                <li><strong>风元素扩散</strong>：利用风元素将元素扩散到多个敌人，造成群体伤害</li>
                <li><strong>岩元素护盾</strong>：结晶反应生成的护盾可以吸收大量伤害</li>
                <li><strong>元素克制</strong>：了解敌人的元素弱点，选择对应的元素攻击</li>
                <li><strong>连续反应</strong>：某些反应之间可以连续触发，造成连锁伤害</li>
            </ul>
        </div>
    `;

    elementContent.innerHTML = elementGridHTML;
}

export function renderUpload() {
    const uploadContent = document.getElementById('upload-content');
    if (!uploadContent) return;

    const uploadHTML = `
        <div class="info-box">
            <h3>提交说明</h3>
            <ul>
                <li><strong>内容真实</strong>：请确保提交的信息准确无误</li>
                <li><strong>排版规范</strong>：使用清晰的段落和标题</li>
                <li><strong>分类正确</strong>：选择合适的词条类型</li>
                <li><strong>审核通过</strong>：提交后需要管理员审核</li>
            </ul>
        </div>

        <form id="uploadForm" onsubmit="return submitEntry(event)">
            <div class="form-group">
                <label class="form-label">词条标题</label>
                <input type="text" class="form-input" id="entryTitle" placeholder="请输入词条标题" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">词条类型</label>
                    <select class="form-select" id="entryType" required>
                        <option value="">请选择类型</option>
                        <option value="weapon">武器</option>
                        <option value="armor">护甲</option>
                        <option value="enemy">敌人</option>
                        <option value="boss">Boss</option>
                        <option value="area">区域</option>
                        <option value="skill">技能</option>
                        <option value="item">物品</option>
                        <option value="other">其他</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">提交者名称</label>
                    <input type="text" class="form-input" id="submitterName" placeholder="请输入您的名称" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">词条内容</label>
                <textarea class="form-textarea" id="entryContent" placeholder="请输入词条的详细内容..." required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">备注（选填）</label>
                <textarea class="form-textarea" id="entryRemark" placeholder="其他需要说明的信息..."></textarea>
            </div>

            <div class="btn-group">
                <button type="submit" class="btn btn-primary">提交词条</button>
                <button type="reset" class="btn">重置表单</button>
            </div>
        </form>
    `;

    uploadContent.innerHTML = uploadHTML;
}

export function renderReview() {
    const reviewContent = document.getElementById('review-content');
    if (!reviewContent) return;

    const reviewHTML = `
        <div class="warning-box">
            <h3>审核说明</h3>
            <ul>
                <li><strong>内容验证</strong>：检查词条内容的准确性和真实性</li>
                <li><strong>格式检查</strong>：确保排版规范，易于阅读</li>
                <li><strong>分类确认</strong>：确认词条类型是否正确</li>
                <li><strong>操作记录</strong>：所有审核操作都会被记录</li>
            </ul>
        </div>

        <div id="reviewList">
            <div class="info-box" id="noReviewItems">
                <h3>暂无待审核词条</h3>
                <p>当前没有需要审核的词条提交。</p>
            </div>
        </div>
    `;

    reviewContent.innerHTML = reviewHTML;
}
