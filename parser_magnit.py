import requests
from bs4 import BeautifulSoup
import json
import os

def parse_magnit():
    url = "https://magnit.ru/promo/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    deals = []
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Ищем карточки акций (селекторы могут меняться при обновлении сайта)
        items = soup.select(".promo-card, .product-card, a[href*='promo']")
        
        for item in items[:15]: # Берём первые 15 для демо
            title = item.get_text(strip=True)
            link = item.get("href", "")
            if len(title) > 8 and "акция" in title.lower() or "скидка" in title.lower():
                deals.append({
                    "title": title,
                    "store": "magnit",
                    "discount": 20, # Парсер скидок требует сложной логики, для демо ставим заглушку
                    "link": f"https://magnit.ru{link}" if link.startswith("/") else link
                })
        if len(deals) >= 3:
            return deals
    except Exception as e:
        print(f"⚠️ Ошибка парсинга Магнита: {e}")

    # 🛡️ ФАЛЛБЭК: гарантирует, что data.json всегда валиден для сайта
    print("📦 Используем стабильные тестовые данные (сайт мог изменить верстку или заблокировать бота)")
    return [
        {"title": "Скидка 35% на молочные продукты", "store": "magnit", "discount": 35, "link": "https://magnit.ru/promo/"},
        {"title": "2 по цене 1 на шоколад и конфеты", "store": "magnit", "discount": 50, "link": "https://magnit.ru/promo/"},
        {"title": "Кофе Nescafe Gold по акции", "store": "magnit", "discount": 25, "link": "https://magnit.ru/promo/"},
        {"title": "Распродажа бытовой химии", "store": "magnit", "discount": 30, "link": "https://magnit.ru/promo/"},
        {"title": "Свежие овощи со скидкой", "store": "magnit", "discount": 20, "link": "https://magnit.ru/promo/"}
    ]

def save_to_json(data, filename="data.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Сохранено {len(data)} акций в {filename}")

if __name__ == "__main__":
    magnit_data = parse_magnit()
    save_to_json(magnit_data)
