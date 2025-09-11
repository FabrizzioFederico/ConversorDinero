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
    // Monedas principales
    { code: 'USD', name: 'Dólar Estadounidense' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Yen Japonés' },
    { code: 'CHF', name: 'Franco Suizo' },
    { code: 'CAD', name: 'Dólar Canadiense' },
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'NZD', name: 'Dólar Neozelandés' },
    
    // Monedas asiáticas
    { code: 'CNY', name: 'Yuan Chino' },
    { code: 'KRW', name: 'Won Surcoreano' },
    { code: 'SGD', name: 'Dólar de Singapur' },
    { code: 'HKD', name: 'Dólar de Hong Kong' },
    { code: 'THB', name: 'Baht Tailandés' },
    { code: 'INR', name: 'Rupia India' },
    { code: 'IDR', name: 'Rupia Indonesia' },
    { code: 'MYR', name: 'Ringgit Malayo' },
    { code: 'PHP', name: 'Peso Filipino' },
    { code: 'VND', name: 'Dong Vietnamita' },
    { code: 'PKR', name: 'Rupia Pakistaní' },
    { code: 'LKR', name: 'Rupia de Sri Lanka' },
    { code: 'BDT', name: 'Taka de Bangladesh' },
    
    // Monedas latinoamericanas
    { code: 'ARS', name: 'Peso Argentino' },
    { code: 'BRL', name: 'Real Brasileño' },
    { code: 'MXN', name: 'Peso Mexicano' },
    { code: 'CLP', name: 'Peso Chileno' },
    { code: 'COP', name: 'Peso Colombiano' },
    { code: 'PEN', name: 'Sol Peruano' },
    { code: 'UYU', name: 'Peso Uruguayo' },
    { code: 'BOB', name: 'Boliviano' },
    { code: 'PYG', name: 'Guaraní Paraguayo' },
    { code: 'VES', name: 'Bolívar Venezolano' },
    { code: 'GTQ', name: 'Quetzal Guatemalteco' },
    { code: 'CRC', name: 'Colón Costarricense' },
    { code: 'PAB', name: 'Balboa Panameño' },
    { code: 'HNL', name: 'Lempira Hondureño' },
    { code: 'NIO', name: 'Córdoba Nicaragüense' },
    { code: 'SVC', name: 'Colón Salvadoreño' },
    { code: 'DOP', name: 'Peso Dominicano' },
    { code: 'JMD', name: 'Dólar Jamaiquino' },
    { code: 'TTD', name: 'Dólar de Trinidad y Tobago' },
    
    // Monedas europeas (no euro)
    { code: 'NOK', name: 'Corona Noruega' },
    { code: 'SEK', name: 'Corona Sueca' },
    { code: 'DKK', name: 'Corona Danesa' },
    { code: 'ISK', name: 'Corona Islandesa' },
    { code: 'PLN', name: 'Zloty Polaco' },
    { code: 'CZK', name: 'Corona Checa' },
    { code: 'HUF', name: 'Forint Húngaro' },
    { code: 'RON', name: 'Leu Rumano' },
    { code: 'BGN', name: 'Lev Búlgaro' },
    { code: 'HRK', name: 'Kuna Croata' },
    { code: 'RSD', name: 'Dinar Serbio' },
    { code: 'BAM', name: 'Marco Bosnio' },
    { code: 'MKD', name: 'Denar Macedonio' },
    { code: 'ALL', name: 'Lek Albanés' },
    { code: 'MDL', name: 'Leu Moldavo' },
    { code: 'UAH', name: 'Grivna Ucraniana' },
    { code: 'BYN', name: 'Rublo Bielorruso' },
    { code: 'RUB', name: 'Rublo Ruso' },
    { code: 'TRY', name: 'Lira Turca' },
    
    // Monedas africanas
    { code: 'ZAR', name: 'Rand Sudafricano' },
    { code: 'NGN', name: 'Naira Nigeriana' },
    { code: 'EGP', name: 'Libra Egipcia' },
    { code: 'KES', name: 'Chelín Keniano' },
    { code: 'UGX', name: 'Chelín Ugandés' },
    { code: 'TZS', name: 'Chelín Tanzano' },
    { code: 'ETB', name: 'Birr Etíope' },
    { code: 'GHS', name: 'Cedi Ghanés' },
    { code: 'XOF', name: 'Franco CFA Occidental' },
    { code: 'XAF', name: 'Franco CFA Central' },
    { code: 'MAD', name: 'Dirham Marroquí' },
    { code: 'TND', name: 'Dinar Tunecino' },
    { code: 'DZD', name: 'Dinar Argelino' },
    { code: 'LYD', name: 'Dinar Libio' },
    { code: 'SDG', name: 'Libra Sudanesa' },
    { code: 'ZMW', name: 'Kwacha Zambiano' },
    { code: 'BWP', name: 'Pula de Botsuana' },
    { code: 'NAD', name: 'Dólar Namibio' },
    { code: 'SZL', name: 'Lilangeni de Esuatini' },
    { code: 'LSL', name: 'Loti de Lesoto' },
    { code: 'MWK', name: 'Kwacha Malauí' },
    { code: 'MZN', name: 'Metical Mozambiqueño' },
    { code: 'AOA', name: 'Kwanza Angoleño' },
    
    // Monedas de Medio Oriente
    { code: 'SAR', name: 'Riyal Saudí' },
    { code: 'AED', name: 'Dirham de los EAU' },
    { code: 'QAR', name: 'Riyal Qatarí' },
    { code: 'KWD', name: 'Dinar Kuwaití' },
    { code: 'BHD', name: 'Dinar Bahreiní' },
    { code: 'OMR', name: 'Rial Omaní' },
    { code: 'JOD', name: 'Dinar Jordano' },
    { code: 'LBP', name: 'Libra Libanesa' },
    { code: 'SYP', name: 'Libra Siria' },
    { code: 'IQD', name: 'Dinar Iraquí' },
    { code: 'IRR', name: 'Rial Iraní' },
    { code: 'AFN', name: 'Afgani Afgano' },
    { code: 'ILS', name: 'Nuevo Shekel Israelí' },
    
    // Monedas de Oceanía
    { code: 'FJD', name: 'Dólar Fiyiano' },
    { code: 'PGK', name: 'Kina de Papúa Nueva Guinea' },
    { code: 'SBD', name: 'Dólar de las Islas Salomón' },
    { code: 'VUV', name: 'Vatu de Vanuatu' },
    { code: 'WST', name: 'Tala Samoano' },
    { code: 'TOP', name: 'Pa\'anga Tongano' },
    
    // Otras monedas importantes
    { code: 'RWF', name: 'Franco Ruandés' },
    { code: 'BIF', name: 'Franco Burundés' },
    { code: 'DJF', name: 'Franco Yibutiano' },
    { code: 'ERN', name: 'Nakfa Eritreo' },
    { code: 'SOS', name: 'Chelín Somalí' },
    { code: 'SCR', name: 'Rupia de Seychelles' },
    { code: 'MUR', name: 'Rupia Mauriciana' },
    { code: 'MVR', name: 'Rufiyaa Maldiva' },
    { code: 'KMF', name: 'Franco Comorense' },
    { code: 'MGA', name: 'Ariary Malgache' },
    { code: 'STN', name: 'Dobra de Santo Tomé' },
    { code: 'CVE', name: 'Escudo Caboverdiano' },
    { code: 'GNF', name: 'Franco Guineano' },
    { code: 'SLE', name: 'Leone de Sierra Leona' },
    { code: 'LRD', name: 'Dólar Liberiano' },
    { code: 'GMD', name: 'Dalasi Gambiano' }
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
