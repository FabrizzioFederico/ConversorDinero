// Elementos del DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const swapButton = document.getElementById('swapButton');
const resultDiv = document.getElementById('result');
const convertedAmountSpan = document.getElementById('convertedAmount');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('closeMenu');
const historyList = document.getElementById('historyList');

// Estado de la aplicación
let isLoading = false;

/**
 * Función para cargar las monedas en los selectores
 */
function loadCurrencies() {
    const currencies = window.CurrencyAPI.getCurrencies();
    
    // Limpiar opciones existentes
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';
    
    // Agregar todas las monedas a ambos selectores
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.code} - ${currency.name}`;
        fromCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency.code;
        option2.textContent = `${currency.code} - ${currency.name}`;
        toCurrencySelect.appendChild(option2);
    });
    
    // Establecer valores por defecto
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
}

/**
 * Función para mostrar el resultado de la conversión
 * @param {number} amount - Cantidad original
 * @param {string} fromCurrency - Moneda de origen
 * @param {string} toCurrency - Moneda de destino
 * @param {number} convertedAmount - Cantidad convertida
 */
function displayResult(amount, fromCurrency, toCurrency, convertedAmount) {
    const formattedAmount = convertedAmount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const originalFormatted = amount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    convertedAmountSpan.textContent = `${originalFormatted} ${fromCurrency} = ${formattedAmount} ${toCurrency}`;
    convertedAmountSpan.style.color = '#333';
    resultDiv.style.display = 'block';
    
    // Agregar animación de resultado
    resultDiv.classList.add('result-animation');
    setTimeout(() => {
        resultDiv.classList.remove('result-animation');
    }, 500);
}

/**
 * Función para mostrar errores
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    convertedAmountSpan.textContent = message;
    convertedAmountSpan.style.color = '#e74c3c';
    resultDiv.style.display = 'block';
    
    // Agregar animación de error
    resultDiv.classList.add('error-animation');
    setTimeout(() => {
        resultDiv.classList.remove('error-animation');
    }, 500);
}

/**
 * Función para mostrar estado de carga
 */
function showLoading() {
    convertedAmountSpan.textContent = 'Convirtiendo...';
    convertedAmountSpan.style.color = '#666';
    resultDiv.style.display = 'block';
    convertButton.disabled = true;
    isLoading = true;
}

/**
 * Función para ocultar estado de carga
 */
function hideLoading() {
    convertButton.disabled = false;
    isLoading = false;
}

/**
 * Función principal de conversión
 */
async function performConversion() {
    // Prevenir múltiples conversiones simultáneas
    if (isLoading) return;
    
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Validar entrada
    if (!amount || amount <= 0) {
        showError('Por favor, ingrese una cantidad válida mayor a 0');
        return;
    }
    
    if (!fromCurrency || !toCurrency) {
        showError('Por favor, seleccione las monedas de origen y destino');
        return;
    }
    
    // Mostrar estado de carga
    showLoading();
    
    try {
        // Obtener tasas de cambio actuales
        const rates = await window.CurrencyAPI.fetchExchangeRates('USD');
        
        // Realizar conversión
        const convertedAmount = window.CurrencyAPI.convertCurrency(
            amount, 
            fromCurrency, 
            toCurrency, 
            rates
        );
        
        // Mostrar resultado
        displayResult(amount, fromCurrency, toCurrency, convertedAmount);
        
        // Agregar al historial
        saveToHistory(amount, fromCurrency, toCurrency, convertedAmount);
        
    } catch (error) {
        console.error('Error en la conversión:', error);
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Función para intercambiar monedas
 */
function swapCurrencies() {
    if (isLoading) return;
    
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;
    
    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;
    
    // Agregar animación al botón de intercambio
    swapButton.classList.add('swap-animation');
    setTimeout(() => {
        swapButton.classList.remove('swap-animation');
    }, 300);
    
    // Si hay un resultado visible, reconvertir automáticamente
    if (resultDiv.style.display === 'block' && amountInput.value && !isLoading) {
        setTimeout(performConversion, 300); // Delay para que se vea la animación
    }
}

/**
 * Función para validar entrada numérica
 * @param {Event} event - Evento de input
 */
function validateNumericInput(event) {
    const value = event.target.value;
    
    // Permitir solo números, punto decimal y coma (para separador decimal)
    if (!/^[\d.,]*$/.test(value)) {
        event.target.value = value.slice(0, -1);
        return;
    }
    
    // Prevenir múltiples puntos decimales
    const decimalCount = (value.match(/[.,]/g) || []).length;
    if (decimalCount > 1) {
        event.target.value = value.slice(0, -1);
    }
}

/**
 * Función para formatear el input mientras se escribe
 * @param {Event} event - Evento de input
 */
function formatInput(event) {
    let value = event.target.value;
    
    // Reemplazar comas por puntos para el cálculo
    value = value.replace(',', '.');
    
    // Actualizar el valor del input
    event.target.value = value;
}

/**
 * Función para guardar la última conversión
 * @param {number} amount - Cantidad
 * @param {string} from - Moneda de origen
 * @param {string} to - Moneda de destino
 * @param {number} result - Resultado
 */
function saveLastConversion(amount, from, to, result) {
    const conversion = {
        amount,
        from,
        to,
        result,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('lastConversion', JSON.stringify(conversion));
    } catch (error) {
        console.warn('No se pudo guardar la conversión en localStorage:', error);
    }
}

/**
 * Función para cargar la última conversión
 */
function loadLastConversion() {
    try {
        const lastConversion = localStorage.getItem('lastConversion');
        if (lastConversion) {
            const conversion = JSON.parse(lastConversion);
            
            // Solo cargar si fue en las últimas 24 horas
            const lastTime = new Date(conversion.timestamp);
            const now = new Date();
            const hoursDiff = (now - lastTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                amountInput.value = conversion.amount;
                fromCurrencySelect.value = conversion.from;
                toCurrencySelect.value = conversion.to;
                displayResult(conversion.amount, conversion.from, conversion.to, conversion.result);
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar la última conversión:', error);
    }
}

/**
 * Función para limpiar el formulario
 */
function clearForm() {
    amountInput.value = '';
    resultDiv.style.display = 'none';
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
}

/**
 * Función para manejar atajos de teclado
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter para convertir
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        performConversion();
    }
    
    // Ctrl/Cmd + S para intercambiar
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        swapCurrencies();
    }
    
    // Escape para limpiar
    if (event.key === 'Escape') {
        clearForm();
    }
}

// Funciones para el menú
function toggleMenu() {
    menuToggle.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenuHandler() {
    menuToggle.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Función para guardar en el historial
function saveToHistory(amount, fromCurrency, toCurrency, result) {
    const conversion = {
        id: Date.now(),
        amount,
        fromCurrency,
        toCurrency,
        result,
        timestamp: new Date().toISOString()
    };

    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history.unshift(conversion);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Función para actualizar el historial en el DOM
function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    historyList.innerHTML = '';

    history.forEach(conversion => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="conversion-details">
                ${conversion.amount} ${conversion.fromCurrency} = 
                ${conversion.result} ${conversion.toCurrency}
                <br>
                <small>${new Date(conversion.timestamp).toLocaleString()}</small>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editConversion(${conversion.id})">Editar</button>
                <button class="delete-btn" onclick="deleteConversion(${conversion.id})">Eliminar</button>
            </div>
        `;
        historyList.appendChild(item);
    });
}

// Variable global para trackear si estamos editando
let currentEditId = null;

// Modificar la función editConversion
function editConversion(id) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const conversion = history.find(item => item.id === id);
    
    if (conversion) {
        currentEditId = id; // Guardar el ID que estamos editando
        amountInput.value = conversion.amount;
        fromCurrencySelect.value = conversion.fromCurrency;
        toCurrencySelect.value = conversion.toCurrency;
        closeMenuHandler();
        
        // Cambiar el texto del botón de convertir
        convertButton.textContent = 'Actualizar';
        convertButton.classList.add('editing');
    }
}

// Modificar la función performConversion
async function performConversion() {
    if (isLoading) return;

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Validar entrada
    if (!amount || amount <= 0) {
        showError('Por favor ingrese una cantidad válida');
        return;
    }
    
    if (!fromCurrency || !toCurrency) {
        showError('Por favor seleccione las monedas');
        return;
    }
    
    showLoading();
    
    try {
        const rates = await window.CurrencyAPI.fetchExchangeRates('USD');
        const convertedAmount = window.CurrencyAPI.convertCurrency(
            amount, 
            fromCurrency, 
            toCurrency, 
            rates
        );
        
        displayResult(amount, fromCurrency, toCurrency, convertedAmount);
        
        // Si estamos editando, actualizar la conversión existente
        if (currentEditId) {
            let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            const index = history.findIndex(item => item.id === currentEditId);
            
            if (index !== -1) {
                history[index] = {
                    ...history[index],
                    amount,
                    fromCurrency,
                    toCurrency,
                    result: convertedAmount,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('conversionHistory', JSON.stringify(history));
                
                // Resetear el estado de edición
                currentEditId = null;
                convertButton.textContent = 'Convertir';
                convertButton.classList.remove('editing');
            }
        } else {
            // Si no estamos editando, crear nueva conversión
            saveToHistory(amount, fromCurrency, toCurrency, convertedAmount);
        }
        
        updateHistoryDisplay();
        
    } catch (error) {
        console.error('Error en la conversión:', error);
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Función para eliminar una conversión
 * @param {number} id - ID de la conversión a eliminar
 */
function deleteConversion(id) {
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Event Listeners y inicialización
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando Conversor de Moneda...');
    
    try {
        // Cargar monedas en los selectores
        loadCurrencies();
        console.log('✅ Monedas cargadas');
        
        // Obtener tasas iniciales
        await window.CurrencyAPI.fetchExchangeRates();
        console.log('✅ Tasas de cambio iniciales obtenidas');
        
        // Iniciar actualización automática
        window.CurrencyAPI.startAutoUpdate(10);
        
        // Cargar última conversión si existe
        loadLastConversion();
        
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
        showError('Error al inicializar la aplicación. Verifique su conexión a internet.');
    }
    
    // Event listeners para botones
    convertButton.addEventListener('click', performConversion);
    swapButton.addEventListener('click', swapCurrencies);
    
    // Event listeners para cambios automáticos
    fromCurrencySelect.addEventListener('change', function() {
        if (amountInput.value && resultDiv.style.display === 'block' && !isLoading) {
            performConversion();
        }
    });
    
    toCurrencySelect.addEventListener('change', function() {
        if (amountInput.value && resultDiv.style.display === 'block' && !isLoading) {
            performConversion();
        }
    });
    
    // Event listeners para el input
    amountInput.addEventListener('input', validateNumericInput);
    amountInput.addEventListener('input', formatInput);
    
    // Event listener para conversión con Enter
    amountInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performConversion();
        }
    });
    
    // Event listener para limpiar resultado cuando se borra el input
    amountInput.addEventListener('input', function() {
        if (!this.value.trim()) {
            resultDiv.style.display = 'none';
        }
    });
    
    // Event listeners para atajos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Event listener para foco automático
    amountInput.focus();
    
    updateHistoryDisplay(); // Cargar el historial inicial
    
    console.log('✅ Conversor de Moneda iniciado correctamente');
});

// Event listeners para el menú
menuToggle.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', closeMenuHandler);
overlay.addEventListener('click', closeMenuHandler);
