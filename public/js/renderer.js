import { escapeHtml } from './utils.js';
import { gameData, weaponData, armorData, enemyData, areaData, itemData, elementData, elementReactionData, skillData } from './data.js';

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

export function createEnemyCard(item) {
    let html = `<div class="enemy-card"><h4>${item.name}</h4><p class="hp">生命值：${item.hp}</p>`;
    if (item.boss || item.elite) {
        html += `<div class="weapon-stats">`;
        html += `<p><strong>出现区域：</strong>${item.area}</p>`;
        html += `<p><strong>等级范围：</strong>随区域变化</p>`;
        html += `<p><strong>元素属性：</strong>${item.element}</p>`;
        html += `<p><strong>特殊技能：</strong></p><ul>`;
        item.skills.forEach(s => html += `<li>${s}</li>`);
        html += `</ul>`;
        if (item.drop) html += `<p><strong>掉落物品：</strong>${item.drop}</p>`;
        html += `</div>`;
    } else {
        html += `<p>${item.desc}</p>`;
    }
    html += `</div>`;
    return html;
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
        html += `
            <div class="area-card">
                <h4>${area.name}</h4>
                <p class="level">${area.type}</p>
                <p>${area.desc}</p>
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
                    <p><strong>等级范围：</strong>${enemy.levelRange || '随区域变化'}</p>
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
                    <p><strong>掉落物品：</strong>${enemy.drop}</p>
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
                        ${enemy.levelRange ? `<p><strong>等级范围：</strong>${enemy.levelRange}</p>` : ''}
                        ${enemy.hpFormula ? `<p><strong>生命值公式：</strong>${enemy.hpFormula}</p>` : ''}
                        ${enemy.attackMethods ? `<p><strong>攻击方式：</strong>${enemy.attackMethods.join('、')}</p>` : enemy.skills ? `<p><strong>攻击方式：</strong>${enemy.skills.join('、')}</p>` : ''}
                        ${enemy.element ? `<p><strong>元素属性：</strong>${enemy.element}</p>` : ''}
                        ${enemy.drop ? `<p><strong>掉落物品：</strong>${enemy.drop}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const bossSection = enemySection.querySelector('#boss-enemies');
    if (bossSection) {
        const h3Normal = enemySection.querySelector('h3:nth-of-type(1)');
        if (h3Normal && h3Normal.textContent === '普通敌人') {
            h3Normal.insertAdjacentHTML('afterend', normalEnemyGridHTML);
        }
    }
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
                    ${weapon.source ? `<p><strong>获取途径：</strong>${weapon.source}</p>` : ''}
                    <p><strong>稀有度：</strong>${'★'.repeat(weapon.rarity || 1)}</p>
                    ${weapon.attackMethod ? `<p><strong>攻击方式：</strong>${weapon.attackMethod}</p>` : ''}
                    ${weapon.damageFormula ? `<p><strong>伤害公式：</strong>${weapon.damageFormula}</p>` : ''}
                    ${weapon.damageFormulaLand ? `<p><strong>伤害公式（陆地）：</strong>${weapon.damageFormulaLand}</p>` : ''}
                    ${weapon.damageFormulaWater ? `<p><strong>伤害公式（水下）：</strong>${weapon.damageFormulaWater}</p>` : ''}
                    ${weapon.element ? `<p><strong>元素类型：</strong>${weapon.element}</p>` : ''}
                    ${weapon.specialEffect ? `<p><strong>特殊效果：</strong>${weapon.specialEffect}</p>` : ''}
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
        html += `
            <div class="weapon-card">
                <h4>${armor.name}</h4>
                <p>${armor.desc || ''}</p>
                <div class="weapon-stats">
                    <p><strong>类型：</strong>${armor.type}</p>
                    ${armor.durability ? `<p><strong>耐久度：</strong>${armor.durability}</p>` : ''}
                    ${armor.set ? `<p><strong>套装组成：</strong>${armor.set}</p>` : ''}
                    ${armor.physicalDefense ? `<p><strong>物理防御：</strong>${armor.physicalDefense}</p>` : ''}
                    ${armor.elementDefense ? `<p><strong>元素防御：</strong>${armor.elementDefense}</p>` : ''}
                    ${armor.iceDefense ? `<p><strong>冰系防御：</strong>${armor.iceDefense}</p>` : ''}
                    ${armor.otherElementDefense ? `<p><strong>其他元素防御：</strong>${armor.otherElementDefense}</p>` : ''}
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

    // 渲染消耗品
    if (consumables.length > 0) {
        const consumablesHTML = `
            <h3>消耗品</h3>
            <div class="item-category">
                <table class="item-table consumables-table">
                    <thead>
                        <tr><th>名称</th><th>效果/用途</th><th>类别</th></tr>
                    </thead>
                    <tbody>
                        ${consumables.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.effect}</td>
                                <td>${item.category}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        itemsSection.insertAdjacentHTML('beforeend', consumablesHTML);
    }

    // 渲染材料
    if (materials.length > 0) {
        const materialsHTML = `
            <h3>材料</h3>
            <div class="item-category">
                <table class="item-table materials-table">
                    <thead>
                        <tr><th>名称</th><th>用途</th><th>类别</th></tr>
                    </thead>
                    <tbody>
                        ${materials.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.usage}</td>
                                <td>${item.category}</td>
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

    const damageHTML = `
        <div class="info-box">
            <h3>伤害计算公式</h3>
            <div class="formula-box">
                <p class="formula">基础伤害 = 攻击力 × 技能倍率 × 伤害加成</p>
                <p class="formula">最终伤害 = 基础伤害 × (1 - 防御力减免) × (1 - 元素抗性减免)</p>
            </div>
        </div>
        <div class="info-box">
            <h3>伤害类型</h3>
            <ul>
                <li>物理伤害 - 基于角色的物理攻击力和武器伤害</li>
                <li>元素伤害 - 基于角色的元素精通和元素伤害加成（火、冰、雷、风、草、岩、水）</li>
                <li>真实伤害 - 无视防御和抗性，直接造成固定伤害</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>伤害加成因素</h3>
            <ul>
                <li>武器伤害和攻击力</li>
                <li>元素伤害加成（来自武器、圣遗物、角色天赋）</li>
                <li>暴击率和暴击伤害</li>
                <li>元素精通（影响元素反应伤害）</li>
                <li>敌人弱点和抗性</li>
                <li>队伍元素共鸣效果</li>
            </ul>
        </div>
    `;

    damageContent.innerHTML = damageHTML;
}

export function renderElement() {
    const elementContent = document.getElementById('element-content');
    if (!elementContent) return;

    const elementHTML = `
        <h3>元素类型</h3>
        <div class="element-grid">
            <div class="element-item">
                <div class="element-icon element-fire">火</div>
                <h4>火</h4>
                <p>造成持续燃烧伤害，融化冰元素</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-ice">冰</div>
                <h4>冰</h4>
                <p>冻结敌人，降低移动速度</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-thunder">雷</div>
                <h4>雷</h4>
                <p>造成麻痹，连锁电击效果</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-earth">岩</div>
                <h4>岩</h4>
                <p>增强防御，造成物理溅射伤害</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-wind">风</div>
                <h4>风</h4>
                <p>扩散其他元素，造成范围伤害</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-water">水</div>
                <h4>水</h4>
                <p>潮湿敌人，与其他元素产生反应</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-grass">草</div>
                <h4>草</h4>
                <p>造成植物生长效果，与水元素产生反应</p>
            </div>
            <div class="element-item">
                <div class="element-icon element-poison">毒</div>
                <h4>剧毒</h4>
                <p>造成持续毒素伤害，降低敌人生命恢复</p>
            </div>
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
                <tr>
                    <td>火 + 水</td>
                    <td>蒸发</td>
                    <td>2.0倍</td>
                    <td>造成大量水属性伤害，移除元素附着</td>
                    <td>0秒</td>
                </tr>
                <tr>
                    <td>火 + 冰</td>
                    <td>融化</td>
                    <td>2.0倍</td>
                    <td>造成大量火属性伤害，移除元素附着</td>
                    <td>0秒</td>
                </tr>
                <tr>
                    <td>雷 + 水</td>
                    <td>感电</td>
                    <td>1.5倍</td>
                    <td>造成持续雷属性伤害，持续期间每0.5秒触发一次</td>
                    <td>4秒</td>
                </tr>
                <tr>
                    <td>冰 + 水</td>
                    <td>冻结</td>
                    <td>1.2倍</td>
                    <td>冻结敌人，使其无法移动和攻击</td>
                    <td>3秒</td>
                </tr>
                <tr>
                    <td>雷 + 火</td>
                    <td>过载</td>
                    <td>1.8倍</td>
                    <td>造成范围爆炸伤害，对周围敌人造成伤害</td>
                    <td>0秒</td>
                </tr>
                <tr>
                    <td>风 + 任意元素</td>
                    <td>扩散</td>
                    <td>1.3倍</td>
                    <td>将元素扩散到周围敌人，造成对应元素伤害</td>
                    <td>0秒</td>
                </tr>
                <tr>
                    <td>岩 + 任意元素</td>
                    <td>结晶</td>
                    <td>1.1倍</td>
                    <td>生成对应元素的护盾，吸收伤害</td>
                    <td>8秒</td>
                </tr>
                <tr>
                    <td>草 + 水</td>
                    <td>绽放</td>
                    <td>1.4倍</td>
                    <td>生成草元素核，爆炸造成范围伤害</td>
                    <td>0秒</td>
                </tr>
                <tr>
                    <td>草 + 雷</td>
                    <td>激化</td>
                    <td>1.6倍</td>
                    <td>提升后续元素伤害</td>
                    <td>6秒</td>
                </tr>
                <tr>
                    <td>剧毒 + 任意元素</td>
                    <td>毒化</td>
                    <td>1.2倍</td>
                    <td>将剧毒元素附着于其他元素上，造成持续伤害</td>
                    <td>5秒</td>
                </tr>
            </tbody>
        </table>
        </div>

        <div class="formula-box">
            <div class="formula-title">元素反应伤害计算详解</div>
            <div class="formula-content">
反应伤害 = 
    触发角色基础攻击力 
    × (1 + 元素伤害加成%) 
    × (1 + 元素精通/200) 
    × 反应倍率 
    × 敌人元素抗性系数</div>
            <div class="formula-note">说明：角色等级也会影响元素反应基础伤害，等级越高基础伤害越高</div>
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
                <li><strong>元素精通堆集</strong>：以元素反应为主的角色应优先堆集元素精通属性</li>
            </ul>
        </div>
    `;

    elementContent.innerHTML = elementHTML;
}

export function renderSkills() {
    const skillsContent = document.getElementById('skills-content');
    if (!skillsContent) return;

    let skillsHTML = '';

    if (skillData.length > 0) {
        skillsHTML = `
            <div class="skill-grid">
                ${skillData.map(skill => `
                    <div class="weapon-card">
                        <h4>${skill.name || '未知技能'}</h4>
                        <p>${skill.description || '无描述'}</p>
                        <div class="weapon-stats">
                            <p><strong>类型：</strong>${skill.type || '未知类型'}</p>
                            ${skill.cooldown ? `<p><strong>冷却时间：</strong>${skill.cooldown}</p>` : ''}
                            ${skill.cost ? `<p><strong>消耗：</strong>${skill.cost}</p>` : ''}
                            ${skill.damage ? `<p><strong>伤害：</strong>${skill.damage}</p>` : ''}
                        </div>
                        ${skill.levels && skill.levels.length > 0 ? `
                            <div class="skill-levels">
                                <h5>等级表</h5>
                                <table class="level-table">
                                    <thead>
                                        <tr><th>等级</th><th>效果</th><th>消耗</th></tr>
                                    </thead>
                                    <tbody>
                                        ${skill.levels.map(level => `
                                            <tr>
                                                <td>${level.level}</td>
                                                <td>${level.value || 'N/A'}</td>
                                                <td>${level.cost || 'N/A'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        skillsHTML = `
            <div class="info-box">
                <h3>技能列表</h3>
                <p>暂无技能数据</p>
            </div>
        `;
    }

    skillsContent.innerHTML = skillsHTML;
}

export function renderGrowth() {
    const growthContent = document.getElementById('growth-content');
    if (!growthContent) return;

    const growthHTML = `
        <h3>升级系统</h3>
        <div class="info-box">
            <h3>升级所需经验值</h3>
            <div class="formula-box">
                <div class="formula-title">升级经验计算公式</div>
                <div class="formula-content">
                    升级到下一等级所需经验值 = 基础值 × 成长系数^当前等级
                </div>
                <div class="formula-note">
                    基础值为500经验值，成长系数为1.2
                </div>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="item-table">
                <tr>
                    <th>等级</th>
                    <th>升级所需经验</th>
                    <th>累计经验</th>
                </tr>
                <tr><td>1</td><td>600</td><td>0</td></tr>
                <tr><td>2</td><td>720</td><td>600</td></tr>
                <tr><td>3</td><td>864</td><td>1,320</td></tr>
                <tr><td>4</td><td>1,037</td><td>2,184</td></tr>
                <tr><td>5</td><td>1,244</td><td>3,221</td></tr>
                <tr><td>6</td><td>1,493</td><td>4,465</td></tr>
                <tr><td>7</td><td>1,792</td><td>5,958</td></tr>
                <tr><td>8</td><td>2,150</td><td>7,750</td></tr>
                <tr><td>9</td><td>2,580</td><td>9,900</td></tr>
                <tr><td>10</td><td>3,096</td><td>12,480</td></tr>
                <tr><td>11</td><td>3,715</td><td>15,576</td></tr>
                <tr><td>12</td><td>4,458</td><td>19,291</td></tr>
                <tr><td>13</td><td>5,350</td><td>23,749</td></tr>
                <tr><td>14</td><td>6,420</td><td>29,099</td></tr>
                <tr><td>15</td><td>7,704</td><td>35,519</td></tr>
                <tr><td>16</td><td>9,245</td><td>43,223</td></tr>
                <tr><td>17</td><td>11,094</td><td>52,468</td></tr>
                <tr><td>18</td><td>13,313</td><td>63,562</td></tr>
                <tr><td>19</td><td>15,976</td><td>76,875</td></tr>
                <tr><td>20</td><td>19,171</td><td>92,851</td></tr>
            </table>
        </div>

        <h3>武器等级限制</h3>
        <div class="formula-box">
            <div class="formula-title">可使用武器等级计算公式</div>
            <div class="formula-content">
                武器最大可使用等级 = 玩家等级 + 10
            </div>
            <div class="formula-note">
                例如：玩家等级为5级时，可使用最高15级的武器
            </div>
        </div>

        <h3>武器升级材料</h3>
        <div class="info-box">
            <h3>升级所需材料</h3>
            <p>武器升级需要消耗货币，不同武器的升级消耗不同。</p>
            <div class="table-wrapper">
                <table class="item-table">
                    <tr>
                        <th>武器名称</th>
                        <th>最高等级</th>
                        <th>所需货币</th>
                        <th>升级消耗公式</th>
                    </tr>
                    <tr><td>白银长枪</td><td>80级</td><td>机械碎片</td><td>50 + 当前等级 × 25</td></tr>
                    <tr><td>机械弩</td><td>80级</td><td>机械碎片</td><td>50 + 当前等级 × 25</td></tr>
                    <tr><td>虚空之枪</td><td>90级</td><td>曙光灵石</td><td>25 + 当前等级 × 10</td></tr>
                    <tr><td>冰系法杖</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>岩刀</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>岩枪</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>炎刀</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>狂涛之弓</td><td>90级</td><td>曙光灵石</td><td>25 + 当前等级 × 10</td></tr>
                    <tr><td>草刀</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>雷刀</td><td>90级</td><td>曙光灵石</td><td>9 + 当前等级 × 5</td></tr>
                    <tr><td>飓风之杖</td><td>90级</td><td>曙光灵石</td><td>25 + 当前等级 × 10</td></tr>
                    <tr><td>渊界撕裂者</td><td>90级</td><td>残响碎片</td><td>375 + 当前等级 × 150</td></tr>
                </table>
            </div>
            <p class="formula-note">
                注意：部分武器标注为[不可升级]，无法进行升级操作
            </p>
        </div>

        <div class="info-box">
            <h3>其他成长相关内容</h3>
            <ul>
                <li><strong>属性成长：</strong>每升一级，基础攻击力、生命值、防御力都会有一定提升</li>
                <li><strong>技能解锁：</strong>达到特定等级后可学习新的技能</li>
                <li><strong>区域解锁：</strong>达到特定等级后可进入更高级的区域</li>
                <li><strong>经验获取：</strong>击败敌人获得经验值，敌人等级越高，获得的经验值越多</li>
            </ul>
        </div>

        <h3>玩家突破材料</h3>
        <div class="info-box">
            <h3>突破所需材料</h3>
            <p>玩家在特定等级需要进行突破才能继续升级，突破需要消耗特定材料。</p>
            <div class="table-wrapper">
                <table class="item-table">
                    <tr>
                        <th>突破等级</th>
                        <th>所需材料</th>
                    </tr>
                    <tr><td>5级突破</td><td>破碎冰晶 × 10、泥潭水晶 × 10</td></tr>
                    <tr><td>10级突破</td><td>破碎冰晶 × 30、泥潭水晶 × 30、冰皇之冕 × 3、机械之心 × 3</td></tr>
                    <tr><td>15级突破</td><td>破碎冰晶 × 64、泥潭水晶 × 64、冰皇之冕 × 10、机械之心 × 10</td></tr>
                    <tr><td>20级突破</td><td>严寒冰晶 × 20、坚石之核 × 20、冰皇之冕 × 15、机械之心 × 15、剧毒之心 × 15</td></tr>
                    <tr><td>25级突破</td><td>严寒冰晶 × 64、坚石之核 × 64、灵魂之骨 × 64、冰皇之冕 × 15、机械之心 × 15、剧毒之心 × 20</td></tr>
                    <tr><td>30级突破</td><td>冰冷核心 × 20、磐岩之心 × 20、骨骸核心 × 20、雪怪水晶 × 100、冰皇之冕 × 20、机械之心 × 20、剧毒之心 × 25</td></tr>
                    <tr><td>35级突破</td><td>鸣雷能量存储核心 × 20、冰冷核心 × 20、磐岩之心 × 20、骨骸核心 × 20、雪怪水晶 × 20、冰皇之冕 × 20、剧毒之心 × 20</td></tr>
                    <tr><td>40级突破</td><td>鸣雷能量存储核心 × 25、冰冷核心 × 20、磐岩之心 × 20、骨骸核心 × 20、雪怪水晶 × 35、冰皇之冕 × 35、剧毒之心 × 35</td></tr>
                    <tr><td>45级突破</td><td>鸣雷能量存储核心 × 32、冰冷核心 × 25、磐岩之心 × 25、骨骸核心 × 25、雪怪水晶 × 20、冰皇之冕 × 20、剧毒之心 × 20、赤焰之心 × 20</td></tr>
                    <tr><td>50级突破</td><td>鸣雷能量存储核心 × 32、冰冷核心 × 32、磐岩之心 × 32、骨骸核心 × 32、雪怪水晶 × 25、冰皇之冕 × 25、剧毒之心 × 25、赤焰之心 × 25</td></tr>
                    <tr><td>55级突破</td><td>鸣雷能量存储核心 × 20、剧毒之心 × 30、赤焰之心 × 30、净水的源初 × 30、爆炎之心 × 30</td></tr>
                    <tr><td>60级突破</td><td>鸣雷能量存储核心 × 64、剧毒之心 × 64、赤焰之心 × 64、净水的源初 × 30、爆炎之心 × 30</td></tr>
                    <tr><td>65级突破</td><td>净水的源初 × 45、爆炎之心 × 45、赤焰之心 × 40、渊界之域的记忆 × 1</td></tr>
                    <tr><td>70级突破</td><td>净水的甘露 × 64、净水的源初 × 45、灼火之心 × 64、爆炎之心 × 45、赤焰之心 × 45、渊界之域的记忆 × 3</td></tr>
                </table>
            </div>
            <p class="formula-note">
                注意：突破后才能继续升级，突破会消耗材料但不提升等级
            </p>
        </div>
    `;

    growthContent.innerHTML = growthHTML;
}

export function renderQuests() {
    const questsContent = document.getElementById('quests-content');
    if (!questsContent) return;

    const questsHTML = `
        <h3>第一章：夜明之地，踏上旅程</h3>
        <ol class="quest-list">
            <li>前往道具店与店员对话</li>
            <li>在道具店购买一些武器</li>
            <li>在餐饮店购买一些食物</li>
            <li>前往附近的雪山，并且启动雪山的传送锚点</li>
            <li>击败3只冰灵</li>
            <li>前往雪山洞中，并且启动寒冰之心的传送锚点</li>
            <li>走上寒冰之心的透明台阶，并击败冰雪女王</li>
            <li>与道具店边上坐在长椅上的老市民对话</li>
            <li>前往埋骨峡谷</li>
            <li>击败6只岩灵水晶或者巡逻机甲</li>
            <li>击败魔力传导训练机甲或者魔力传导训练机甲-狂澜</li>
            <li>继续前往埋骨峡谷</li>
            <li>击败6只骷髅</li>
            <li>启动埋骨峡谷的传送点</li>
            <li>击败剧毒蛛王</li>
            <li>前往酒吧，与神秘人对话</li>
            <li>前往鹰崖城</li>
            <li>启动鹰崖城的传送点</li>
            <li>击败鸣雷重机</li>
            <li>前往酒吧，与血光对话</li>
        </ol>

        <h3>第二章：渊界之域，深入未知</h3>
        <ol class="quest-list">
            <li>在酒吧与血光对话，了解渊界之域的位置</li>
            <li>前往渊界之域入口，调查神秘的能量波动</li>
            <li>击败渊界守卫，打开渊界之域的通道</li>
            <li>进入渊界之域，启动传送锚点</li>
            <li>探索渊界之域，了解这片神秘区域的历史</li>
            <li>击败10只渊界怪物，收集渊界碎片</li>
            <li>找到渊界祭坛，激活古老的符文</li>
            <li>触发渊之魔女的出现</li>
            <li>击败渊之魔女的第一阶段</li>
            <li>见证渊之魔女进入第二阶段，感受更强的力量</li>
            <li>在30%血量时应对渊之魔女的兔子跳模式</li>
            <li>成功击败渊之魔女</li>
            <li>收集渊界之域的记忆，了解真相</li>
            <li>返回酒吧，向血光汇报任务完成</li>
            <li>获得渊界撕裂者作为奖励</li>
            <li>准备迎接更大的挑战</li>
        </ol>

        <div class="info-box">
            <h3>支线任务</h3>
            <ul>
                <li>每日委托：完成日常任务，获得稳定奖励</li>
                <li>世界任务：探索世界，发现隐藏的故事和宝藏</li>
                <li>声望任务：提升各区域声望，解锁区域特色奖励</li>
                <li>活动任务：参与限时活动，获得限定奖励</li>
            </ul>
            <p>完成支线任务，获得额外奖励和剧情信息，深入了解游戏世界</p>
        </div>
        <div class="info-box">
            <h3>任务奖励</h3>
            <ul>
                <li>经验值：提升角色等级</li>
                <li>摩拉：游戏内通用货币</li>
                <li>材料：用于升级和突破</li>
                <li>装备：武器、护甲和圣遗物</li>
                <li>声望：解锁区域特色内容</li>
                <li>成就：解锁成就系统和称号</li>
            </ul>
        </div>
    `;

    questsContent.innerHTML = questsHTML;
}

export function renderTips() {
    const tipsContent = document.getElementById('tips-content');
    if (!tipsContent) return;

    const tipsHTML = `
        <div class="info-box">
            <h3>新手建议</h3>
            <ul>
                <li>优先完成主线任务，解锁更多功能</li>
                <li>注意收集资源，用于装备升级</li>
                <li>合理使用元素反应，提升战斗效率</li>
                <li>解锁传送锚点，方便快速移动</li>
                <li>关注角色状态，及时使用恢复物品</li>
            </ul>
        </div>
        <div class="info-box">
            <h3>战斗技巧</h3>
            <ul>
                <li>观察敌人弱点，使用克制元素</li>
                <li>合理利用技能冷却时间</li>
                <li>保持移动，躲避敌人攻击</li>
                <li>使用环境物品，创造有利条件</li>
            </ul>
        </div>
    `;

    tipsContent.innerHTML = tipsHTML;
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
