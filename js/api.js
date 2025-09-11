// API Configuration
const API_BASE_URL = 'https://open.er-api.com/v6/latest';

// Variables globales para almacenar las tasas de cambio
let exchangeRates = {};

// Monedas disponibles
const currencies = [
    // Monedas principales
    { code: 'USD', name: 'Dólar Estadounidense', country: 'us' },
    { code: 'EUR', name: 'Euro', country: 'eu' },
    { code: 'GBP', name: 'Libra Esterlina', country: 'gb' },
    { code: 'JPY', name: 'Yen Japonés', country: 'jp' },
    { code: 'CHF', name: 'Franco Suizo', country: 'ch' },
    { code: 'CAD', name: 'Dólar Canadiense', country: 'ca' },
    { code: 'AUD', name: 'Dólar Australiano', country: 'au' },
    { code: 'NZD', name: 'Dólar Neozelandés', country: 'nz' },
    
    // Monedas asiáticas
    { code: 'CNY', name: 'Yuan Chino', country: 'cn' },
    { code: 'KRW', name: 'Won Surcoreano', country: 'kr' },
    { code: 'SGD', name: 'Dólar de Singapur', country: 'sg' },
    { code: 'HKD', name: 'Dólar de Hong Kong', country: 'hk' },
    { code: 'THB', name: 'Baht Tailandés', country: 'th' },
    { code: 'INR', name: 'Rupia India', country: 'in' },
    { code: 'IDR', name: 'Rupia Indonesia', country: 'id' },
    { code: 'MYR', name: 'Ringgit Malayo', country: 'my' },
    { code: 'PHP', name: 'Peso Filipino', country: 'ph' },
    { code: 'VND', name: 'Dong Vietnamita', country: 'vn' },
    { code: 'PKR', name: 'Rupia Pakistaní', country: 'pk' },
    { code: 'LKR', name: 'Rupia de Sri Lanka', country: 'lk' },
    { code: 'BDT', name: 'Taka de Bangladesh', country: 'bd' },
    
    // Monedas latinoamericanas
    { code: 'ARS', name: 'Peso Argentino', country: 'ar' },
    { code: 'BRL', name: 'Real Brasileño', country: 'br' },
    { code: 'MXN', name: 'Peso Mexicano', country: 'mx' },
    { code: 'CLP', name: 'Peso Chileno', country: 'cl' },
    { code: 'COP', name: 'Peso Colombiano', country: 'co' },
    { code: 'PEN', name: 'Sol Peruano', country: 'pe' },
    { code: 'UYU', name: 'Peso Uruguayo', country: 'uy' },
    { code: 'BOB', name: 'Boliviano', country: 'bo' },
    { code: 'PYG', name: 'Guaraní Paraguayo', country: 'py' },
    { code: 'VES', name: 'Bolívar Venezolano', country: 've' },
    { code: 'GTQ', name: 'Quetzal Guatemalteco', country: 'gt' },
    { code: 'CRC', name: 'Colón Costarricense', country: 'cr' },
    { code: 'PAB', name: 'Balboa Panameño', country: 'pa' },
    { code: 'HNL', name: 'Lempira Hondureño', country: 'hn' },
    { code: 'NIO', name: 'Córdoba Nicaragüense', country: 'ni' },
    { code: 'SVC', name: 'Colón Salvadoreño', country: 'sv' },
    { code: 'DOP', name: 'Peso Dominicano', country: 'do' },
    { code: 'JMD', name: 'Dólar Jamaiquino', country: 'jm' },
    { code: 'TTD', name: 'Dólar de Trinidad y Tobago', country: 'tt' },
    
    // Monedas europeas (no euro)
    { code: 'NOK', name: 'Corona Noruega', country: 'no' },
    { code: 'SEK', name: 'Corona Sueca', country: 'se' },
    { code: 'DKK', name: 'Corona Danesa', country: 'dk' },
    { code: 'ISK', name: 'Corona Islandesa', country: 'is' },
    { code: 'PLN', name: 'Zloty Polaco', country: 'pl' },
    { code: 'CZK', name: 'Corona Checa', country: 'cz' },
    { code: 'HUF', name: 'Forint Húngaro', country: 'hu' },
    { code: 'RON', name: 'Leu Rumano', country: 'ro' },
    { code: 'BGN', name: 'Lev Búlgaro', country: 'bg' },
    { code: 'HRK', name: 'Kuna Croata', country: 'hr' },
    { code: 'RSD', name: 'Dinar Serbio', country: 'rs' },
    { code: 'BAM', name: 'Marco Bosnio', country: 'ba' },
    { code: 'MKD', name: 'Denar Macedonio', country: 'mk' },
    { code: 'ALL', name: 'Lek Albanés', country: 'al' },
    { code: 'MDL', name: 'Leu Moldavo', country: 'md' },
    { code: 'UAH', name: 'Grivna Ucraniana', country: 'ua' },
    { code: 'BYN', name: 'Rublo Bielorruso', country: 'by' },
    { code: 'RUB', name: 'Rublo Ruso', country: 'ru' },
    { code: 'TRY', name: 'Lira Turca', country: 'tr' },
    
    // Monedas africanas
    { code: 'ZAR', name: 'Rand Sudafricano', country: 'za' },
    { code: 'NGN', name: 'Naira Nigeriana', country: 'ng' },
    { code: 'EGP', name: 'Libra Egipcia', country: 'eg' },
    { code: 'KES', name: 'Chelín Keniano', country: 'ke' },
    { code: 'UGX', name: 'Chelín Ugandés', country: 'ug' },
    { code: 'TZS', name: 'Chelín Tanzano', country: 'tz' },
    { code: 'ETB', name: 'Birr Etíope', country: 'et' },
    { code: 'GHS', name: 'Cedi Ghanés', country: 'gh' },
    { code: 'XOF', name: 'Franco CFA Occidental', country: 'bf' }, // Burkina Faso como representante
    { code: 'XAF', name: 'Franco CFA Central', country: 'cm' }, // Camerún como representante
    { code: 'MAD', name: 'Dirham Marroquí', country: 'ma' },
    { code: 'TND', name: 'Dinar Tunecino', country: 'tn' },
    { code: 'DZD', name: 'Dinar Argelino', country: 'dz' },
    { code: 'LYD', name: 'Dinar Libio', country: 'ly' },
    { code: 'SDG', name: 'Libra Sudanesa', country: 'sd' },
    { code: 'ZMW', name: 'Kwacha Zambiano', country: 'zm' },
    { code: 'BWP', name: 'Pula de Botsuana', country: 'bw' },
    { code: 'NAD', name: 'Dólar Namibio', country: 'na' },
    { code: 'SZL', name: 'Lilangeni de Esuatini', country: 'sz' },
    { code: 'LSL', name: 'Loti de Lesoto', country: 'ls' },
    { code: 'MWK', name: 'Kwacha Malauí', country: 'mw' },
    { code: 'MZN', name: 'Metical Mozambiqueño', country: 'mz' },
    { code: 'AOA', name: 'Kwanza Angoleño', country: 'ao' },
    
    // Monedas de Medio Oriente
    { code: 'SAR', name: 'Riyal Saudí', country: 'sa' },
    { code: 'AED', name: 'Dirham de los EAU', country: 'ae' },
    { code: 'QAR', name: 'Riyal Qatarí', country: 'qa' },
    { code: 'KWD', name: 'Dinar Kuwaití', country: 'kw' },
    { code: 'BHD', name: 'Dinar Bahreiní', country: 'bh' },
    { code: 'OMR', name: 'Rial Omaní', country: 'om' },
    { code: 'JOD', name: 'Dinar Jordano', country: 'jo' },
    { code: 'LBP', name: 'Libra Libanesa', country: 'lb' },
    { code: 'SYP', name: 'Libra Siria', country: 'sy' },
    { code: 'IQD', name: 'Dinar Iraquí', country: 'iq' },
    { code: 'IRR', name: 'Rial Iraní', country: 'ir' },
    { code: 'AFN', name: 'Afgani Afgano', country: 'af' },
    { code: 'ILS', name: 'Nuevo Shekel Israelí', country: 'il' },
    
    // Monedas de Oceanía
    { code: 'FJD', name: 'Dólar Fiyiano', country: 'fj' },
    { code: 'PGK', name: 'Kina de Papúa Nueva Guinea', country: 'pg' },
    { code: 'SBD', name: 'Dólar de las Islas Salomón', country: 'sb' },
    { code: 'VUV', name: 'Vatu de Vanuatu', country: 'vu' },
    { code: 'WST', name: 'Tala Samoano', country: 'ws' },
    { code: 'TOP', name: 'Pa\'anga Tongano', country: 'to' },
    
    // Otras monedas importantes
    { code: 'RWF', name: 'Franco Ruandés', country: 'rw' },
    { code: 'BIF', name: 'Franco Burundés', country: 'bi' },
    { code: 'DJF', name: 'Franco Yibutiano', country: 'dj' },
    { code: 'ERN', name: 'Nakfa Eritreo', country: 'er' },
    { code: 'SOS', name: 'Chelín Somalí', country: 'so' },
    { code: 'SCR', name: 'Rupia de Seychelles', country: 'sc' },
    { code: 'MUR', name: 'Rupia Mauriciana', country: 'mu' },
    { code: 'MVR', name: 'Rufiyaa Maldiva', country: 'mv' },
    { code: 'KMF', name: 'Franco Comorense', country: 'km' },
    { code: 'MGA', name: 'Ariary Malgache', country: 'mg' },
    { code: 'STN', name: 'Dobra de Santo Tomé', country: 'st' },
    { code: 'CVE', name: 'Escudo Caboverdiano', country: 'cv' },
    { code: 'GNF', name: 'Franco Guineano', country: 'gn' },
    { code: 'SLE', name: 'Leone de Sierra Leona', country: 'sl' },
    { code: 'LRD', name: 'Dólar Liberiano', country: 'lr' },
    { code: 'GMD', name: 'Dalasi Gambiano', country: 'gm' }
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
 * Función para obtener la URL de la bandera por código de moneda
 * @param {string} currencyCode - Código de moneda
 * @returns {string} - URL de la bandera o null si no se encuentra
 */
function getFlagUrl(currencyCode) {
    const currency = currencies.find(curr => curr.code === currencyCode);
    return currency ? `https://flagcdn.com/${currency.country}.svg` : null;
}

/**
 * Función para obtener información completa de una moneda
 * @param {string} currencyCode - Código de moneda
 * @returns {Object|null} - Objeto con información completa de la moneda
 */
function getCurrencyInfo(currencyCode) {
    const currency = currencies.find(curr => curr.code === currencyCode);
    if (currency) {
        return {
            ...currency,
            flagUrl: `https://flagcdn.com/${currency.country}.svg`
        };
    }
    return null;
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
        getFlagUrl,
        getCurrencyInfo,
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
        getFlagUrl,
        getCurrencyInfo,
        startAutoUpdate,
        currencies
    };
}
