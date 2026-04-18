let currentStore = "all";

// Убирает пробелы в ключах и значениях (защита от кривого JSON)
function normalizeData(rawArray) {
    return rawArray.map(item => {
        const clean = {};
        for (const [key, val] of Object.entries(item)) {
            clean[key.trim()] = typeof val === 'string' ? val.trim() : val;
        }
        return clean;
    });
}

async function loadDeals() {
    const list = document.getElementById("dealsList");
    try {
        const res = await fetch('data.json?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        
        const rawData = await res.json();
        const deals = normalizeData(rawData);
        
        list.innerHTML = "";
        
        // Фильтрация по магазину (store)
        const filtered = currentStore === "all" 
            ? deals 
            : deals.filter(d => (d.store || '').toLowerCase() === currentStore);

        if (filtered.length === 0) {
            list.innerHTML = `<div class="empty-msg">🔍 В этом магазине пока нет акций</div>`;
            return;
        }

        // Названия магазинов для отображения
        const storeNames = { 
            magnit: "🛒 Магнит", 
            pyaterochka: "🛒 Пятёрочка", 
            dns: "🖥️ DNS", 
            unknown: "🌐 Другой" 
        };

        filtered.forEach(d => {
            const storeKey = (d.store || '').toLowerCase();
            const discount = d.discount || 0;
            const title = d.title || 'Без названия';
            const link = d.link || '#';

            list.innerHTML += `
                <div class="deal-card">
                    <div class="deal-store">${storeNames[storeKey] || storeKey || '🌐'}</div>
                    <div class="deal-title">${title}</div>
                    <div class="deal-discount">Скидка: ${discount}%</div>
                    ${link !== '#' ? `<a href="${link}" target="_blank" style="display:block;margin-top:10px;color:#e74c3c;text-decoration:none;font-weight:500">Перейти →</a>` : ''}
                </div>
            `;
        });
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        list.innerHTML = `<div class="empty-msg">⚠️ Не удалось загрузить данные.<br><small>Проверьте наличие и валидность data.json</small></div>`;
    }
}

// Инициализация
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#storeTabs button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#storeTabs button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentStore = btn.dataset.store;
            loadDeals();
        });
    });
    loadDeals();
});