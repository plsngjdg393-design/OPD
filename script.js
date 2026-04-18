// script.js
async function loadDiscounts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const container = document.getElementById('discounts-container'); // ID блока в HTML, куда выводить
        container.innerHTML = ''; // Очистить старое

        data.forEach(item => {
            const card = `
                <div class="card">
                    <h3>${item.title}</h3>
                    <p>Скидка: ${item.discount}%</p>
                    <span class="badge">${item.category}</span>
                    <a href="${item.link}" target="_blank">Перейти</a>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Запустить при загрузке страницы
document.addEventListener('DOMContentLoaded', loadDiscounts);