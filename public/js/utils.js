export function getElementKey(element) {
    const map = { '火': 'fire', '冰': 'ice', '雷': 'thunder', '岩': 'earth', '风': 'wind', '水': 'water', '草': 'grass', '毒': 'poison' };
    return map[element] || element;
}

export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function handleResize() {
    const weaponCards = document.querySelectorAll('.weapon-card');
    const isMobile = window.innerWidth < 768;
    
    weaponCards.forEach(card => {
        if (isMobile) {
            card.style.padding = '20px';
            card.style.marginBottom = '16px';
        } else {
            card.style.padding = '25px';
            card.style.marginBottom = '0';
        }
    });
}
