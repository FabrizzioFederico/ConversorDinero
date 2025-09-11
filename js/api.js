// API Configuration
const API_BASE_URL = 'https://open.er-api.com/v6/latest';

// Variables globales para almacenar las tasas de cambio
let exchangeRates = {};

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

/**
 * Función para obtener las tasas de cambio desde la API
 * @param {string} baseCurrency - Moneda base para las tasas de cambio (por defecto USD)
 * @returns {Object|null} - Objeto con las tasas de cambio o null si hay error
 */
async function fetchExchangeRates(baseCurrency = 'USD') {
    try {
        const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.rates;
            console.log(`✅ Tasas de cambio actualizadas desde ${baseCurrency}`);
            return data.rates;
        } else {
            throw new Error('Error en la respuesta de la API');
        }
    } catch (error) {
        console.error('❌ Error al obtener tasas de cambio:', error);
        throw new Error(`Error al conectar con la API: ${error.message}`);
    }
}

/**
 * Función para convertir entre monedas
 * @param {number} amount - Cantidad a convertir
 * @param {string} fromCurrency - Moneda de origen
 * @param {string} toCurrency - Moneda de destino
 * @param {Object} rates - Objeto con las tasas de cambio
 * @returns {number} - Cantidad convertida
 */
function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    // Si las monedas son iguales, no hay conversión
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    // Verificar que las tasas existen
    if (!rates) {
        throw new Error('No hay tasas de cambio disponibles');
    }
    
    // Si la moneda base es USD, usamos directamente las tasas
    if (fromCurrency === 'USD') {
        if (!rates[toCurrency]) {
            throw new Error(`Tasa de cambio no disponible para ${toCurrency}`);
        }
        return amount * rates[toCurrency];
    }
    
    // Si convertimos a USD desde otra moneda
    if (toCurrency === 'USD') {
        if (!rates[fromCurrency]) {
            throw new Error(`Tasa de cambio no disponible para ${fromCurrency}`);
        }
        return amount / rates[fromCurrency];
    }
    
    // Para conversión entre dos monedas que no son USD
    // Primero convertimos a USD, luego a la moneda objetivo
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        throw new Error(`Tasas de cambio no disponibles para ${fromCurrency} o ${toCurrency}`);
    }
    
    const usdAmount = amount / rates[fromCurrency];
    return usdAmount * rates[toCurrency];
}

/**
 * Función para obtener la lista de monedas disponibles
 * @returns {Array} - Array de objetos con código y nombre de monedas
 */
function getCurrencies() {
    return currencies;
}

/**
 * Función para obtener las tasas de cambio actuales
 * @returns {Object} - Objeto con las tasas de cambio actuales
 */
function getCurrentRates() {
    return exchangeRates;
}

/**
 * Función para verificar si una moneda está soportada
 * @param {string} currencyCode - Código de moneda a verificar
 * @returns {boolean} - True si la moneda está soportada
 */
function isCurrencySupported(currencyCode) {
    return currencies.some(currency => currency.code === currencyCode);
}

/**
 * Función para obtener el nombre de una moneda por su código
 * @param {string} currencyCode - Código de moneda
 * @returns {string} - Nombre de la moneda o el código si no se encuentra
 */
function getCurrencyName(currencyCode) {
    const currency = currencies.find(curr => curr.code === currencyCode);
    return currency ? currency.name : currencyCode;
}

/**
 * Función para actualizar las tasas de cambio automáticamente
 * @param {number} intervalMinutes - Intervalo en minutos para actualizar (por defecto 10)
 */
function startAutoUpdate(intervalMinutes = 10) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    setInterval(async () => {
        try {
            await fetchExchangeRates();
            console.log(`🔄 Tasas de cambio actualizadas automáticamente`);
        } catch (error) {
            console.error('❌ Error en actualización automática:', error);
        }
    }, intervalMs);
    
    console.log(`⏰ Actualización automática configurada cada ${intervalMinutes} minutos`);
}

// Exportar funciones para uso en otros archivos
if (typeof window !== 'undefined') {
    // En el navegador, agregar al objeto global window
    window.CurrencyAPI = {
        fetchExchangeRates,
        convertCurrency,
        getCurrencies,
        getCurrentRates,
        isCurrencySupported,
        getCurrencyName,
        startAutoUpdate
    };
}

// Para Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchExchangeRates,
        convertCurrency,
        getCurrencies,
        getCurrentRates,
        isCurrencySupported,
        getCurrencyName,
        startAutoUpdate,
        currencies
    };
}
