async function loadDiscounts() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        if (!response.ok) throw new Error('HTTP ' + response.status);
        
        const data = await response.json();
        const container = document.getElementById('discounts-container') || document.getElementById('dealsList');
        
        if (!container) {
            console.error('Контейнер для карточек не найден в HTML');
            return;
        }

        container.innerHTML = '';

        data.forEach(item => { // ← Исправлено: убран пробел в "=>"
            const title = item.title?.trim() || 'Без названия';
            const discount = item.discount || 0;
            const category = item.category?.trim() || 'other';
            const link = item.link?.trim() || '#';

            const card = `
                <div class="deal-card">
                    <div class="deal-source">🌐 ${category}</div>
                    <div class="deal-title">${title}</div>
                    <div class="deal-discount">Скидка: ${discount}%</div>
                    ${link !== '#' ? `<a href="${link}" target="_blank" style="display:block;margin-top:10px;color:#e74c3c;text-decoration:none;font-weight:500">Перейти →</a>` : ''}
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const container = document.getElementById('discounts-container') || document.getElementById('dealsList');
        if (container) {
            container.innerHTML = `<div class="empty-msg">⚠️ Ошибка загрузки: ${error.message}<br><small>Проверьте валидность data.json</small></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', loadDiscounts);