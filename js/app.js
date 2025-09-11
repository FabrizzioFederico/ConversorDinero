// Variables globales para almacenar las tasas de cambio
let exchangeRates = {};

// Elementos del DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const swapButton = document.getElementById('swapButton');
const resultDiv = document.getElementById('result');
const convertedAmountSpan = document.getElementById('convertedAmount');

// URL base de la API
const API_BASE_URL = 'https://open.er-api.com/v6/latest';

// Monedas disponibles
const currencies = [
    { code: 'USD', name: 'Dólar Estadounidense' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Yen Japonés' },
    { code: 'CAD', name: 'Dólar Canadiense' },
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'CHF', name: 'Franco Suizo' },
    { code: 'CNY', name: 'Yuan Chino' },
    { code: 'ARS', name: 'Peso Argentino' },
    { code: 'BRL', name: 'Real Brasileño' },
    { code: 'MXN', name: 'Peso Mexicano' },
    { code: 'CLP', name: 'Peso Chileno' }
];

// Función para cargar las monedas en los selectores
function loadCurrencies() {
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

// Función para obtener las tasas de cambio desde la API
async function fetchExchangeRates(baseCurrency = 'USD') {
    try {
        const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.rates;
            return data.rates;
        } else {
            throw new Error('Error en la respuesta de la API');
        }
    } catch (error) {
        console.error('Error al obtener tasas de cambio:', error);
        showError('Error al obtener las tasas de cambio. Por favor, intente nuevamente.');
        return null;
    }
}

// Función para convertir moneda
function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    // Si la moneda base es USD, usamos directamente las tasas
    if (fromCurrency === 'USD') {
        return amount * rates[toCurrency];
    }
    
    // Si convertimos a USD desde otra moneda
    if (toCurrency === 'USD') {
        return amount / rates[fromCurrency];
    }
    
    // Para conversión entre dos monedas que no son USD
    // Primero convertimos a USD, luego a la moneda objetivo
    const usdAmount = amount / rates[fromCurrency];
    return usdAmount * rates[toCurrency];
}

// Función para mostrar el resultado
function displayResult(amount, fromCurrency, toCurrency, convertedAmount) {
    const formattedAmount = convertedAmount.toFixed(2);
    convertedAmountSpan.textContent = `${amount} ${fromCurrency} = ${formattedAmount} ${toCurrency}`;
    resultDiv.style.display = 'block';
}

// Función para mostrar errores
function showError(message) {
    convertedAmountSpan.textContent = message;
    convertedAmountSpan.style.color = '#e74c3c';
    resultDiv.style.display = 'block';
}

// Función para limpiar errores
function clearError() {
    convertedAmountSpan.style.color = '#333';
}

// Función principal de conversión
async function performConversion() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Validar entrada
    if (!amount || amount <= 0) {
        showError('Por favor, ingrese una cantidad válida mayor a 0');
        return;
    }
    
    // Limpiar errores previos
    clearError();
    
    // Mostrar indicador de carga
    convertedAmountSpan.textContent = 'Convirtiendo...';
    convertButton.disabled = true;
    
    try {
        // Obtener tasas de cambio (usando USD como base)
        const rates = await fetchExchangeRates('USD');
        
        if (!rates) {
            convertButton.disabled = false;
            return;
        }
        
        // Realizar conversión
        const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency, rates);
        
        // Mostrar resultado
        displayResult(amount, fromCurrency, toCurrency, convertedAmount);
        
    } catch (error) {
        console.error('Error en la conversión:', error);
        showError('Error al realizar la conversión. Por favor, intente nuevamente.');
    } finally {
        convertButton.disabled = false;
    }
}

// Función para intercambiar monedas
function swapCurrencies() {
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;
    
    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;
    
    // Si hay un resultado visible, reconvertir automáticamente
    if (resultDiv.style.display === 'block' && amountInput.value) {
        performConversion();
    }
}

// Función para validar entrada numérica
function validateNumericInput(event) {
    const value = event.target.value;
    
    // Permitir solo números y punto decimal
    if (!/^\d*\.?\d*$/.test(value)) {
        event.target.value = value.slice(0, -1);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar monedas en los selectores
    loadCurrencies();
    
    // Obtener tasas iniciales
    fetchExchangeRates();
    
    // Event listener para el botón de conversión
    convertButton.addEventListener('click', performConversion);
    
    // Event listener para el botón de intercambio
    swapButton.addEventListener('click', swapCurrencies);
    
    // Event listener para conversión automática al cambiar monedas
    fromCurrencySelect.addEventListener('change', function() {
        if (amountInput.value && resultDiv.style.display === 'block') {
            performConversion();
        }
    });
    
    toCurrencySelect.addEventListener('change', function() {
        if (amountInput.value && resultDiv.style.display === 'block') {
            performConversion();
        }
    });
    
    // Event listener para validar entrada numérica
    amountInput.addEventListener('input', validateNumericInput);
    
    // Event listener para conversión con Enter
    amountInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performConversion();
        }
    });
    
    // Event listener para limpiar resultado cuando se borra el input
    amountInput.addEventListener('input', function() {
        if (!this.value) {
            resultDiv.style.display = 'none';
        }
    });
});

// Función para actualizar tasas de cambio cada 10 minutos
setInterval(() => {
    fetchExchangeRates();
    console.log('Tasas de cambio actualizadas');
}, 600000); // 10 minutos

// Exportar funciones para testing (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertCurrency,
        fetchExchangeRates,
        currencies
    };
}
