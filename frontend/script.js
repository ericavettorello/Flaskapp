// Базовый URL для API
// В Docker Compose используем прокси через nginx (/api), локально - localhost:5001
const API_URL = (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    // Если запущено локально на порту 3000 (через Docker), используем прокси
    // Если запущено напрямую (не через Docker), используем localhost:5001
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '3000') {
        // Фронтенд в Docker, используем прокси
        return '/api';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Локальная разработка без Docker
        return 'http://localhost:5001';
    }
    // В Docker используем прокси через nginx
    return '/api';
})();

// Загрузка информации о приложении
async function loadInfo() {
    const content = document.getElementById('info-content');
    content.innerHTML = '<p class="loading">Загрузка...</p>';
    
    try {
        const response = await fetch(`${API_URL}/info`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        content.innerHTML = `
            <div class="info-item">
                <strong>Название:</strong> ${data.app_name}
            </div>
            <div class="info-item">
                <strong>Версия:</strong> ${data.version}
            </div>
            <div class="info-item">
                <strong>Описание:</strong> ${data.description}
            </div>
            <div class="info-item">
                <strong>Автор:</strong> ${data.author}
            </div>
        `;
        
        // Обновляем версию в статус-баре
        document.getElementById('version-value').textContent = data.version;
    } catch (error) {
        content.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// Загрузка health check
async function loadHealth() {
    const content = document.getElementById('health-content');
    const healthValue = document.getElementById('health-value');
    content.innerHTML = '<p class="loading">Загрузка...</p>';
    
    try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        content.innerHTML = `
            <div class="info-item">
                <strong>Статус:</strong> <span style="color: #10b981; font-weight: bold;">${data.status}</span>
            </div>
            <div class="info-item">
                <strong>Сервис:</strong> ${data.service}
            </div>
            <div class="info-item">
                <strong>Версия:</strong> ${data.version}
            </div>
        `;
        
        // Обновляем статус в статус-баре
        healthValue.textContent = data.status.toUpperCase();
        healthValue.className = 'status-value ' + (data.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
        content.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
        healthValue.textContent = 'ERROR';
        healthValue.className = 'status-value unhealthy';
    }
}

// Загрузка эндпоинтов
async function loadEndpoints() {
    const content = document.getElementById('endpoints-content');
    content.innerHTML = '<p class="loading">Загрузка...</p>';
    
    try {
        const response = await fetch(`${API_URL}/`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const data = await response.json();
        const endpoints = Object.entries(data.endpoints);
        
        let html = '<ul class="endpoint-list">';
        endpoints.forEach(([path, description]) => {
            html += `
                <li class="endpoint-item">
                    <strong>${path}</strong><br>
                    <span>${description}</span>
                </li>
            `;
        });
        html += '</ul>';
        
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// Вычисление суммы
async function calculate() {
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;
    const resultDiv = document.getElementById('calc-result');
    
    if (!num1 || !num2) {
        resultDiv.innerHTML = '<div class="error">Пожалуйста, введите оба числа</div>';
        resultDiv.classList.add('show');
        return;
    }
    
    resultDiv.innerHTML = '<p class="loading">Вычисление...</p>';
    resultDiv.classList.add('show');
    
    try {
        const response = await fetch(`${API_URL}/calc/${num1}/${num2}`);
        if (!response.ok) throw new Error('Ошибка вычисления');
        
        const data = await response.json();
        resultDiv.innerHTML = `
            <h3>Результат вычисления</h3>
            <div style="text-align: center; margin: 10px 0;">
                <span style="font-size: 1.2em;">${data.a} + ${data.b} = </span>
                <span class="result-value">${data.result}</span>
            </div>
            <div class="info-item">
                <strong>Операция:</strong> ${data.operation}
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

// Автоматическая загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadInfo();
    loadHealth();
    loadEndpoints();
    
    // Автообновление каждые 30 секунд
    setInterval(() => {
        loadHealth();
    }, 30000);
});

// Обработка Enter в полях калькулятора
document.getElementById('num1').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
});

document.getElementById('num2').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
});

