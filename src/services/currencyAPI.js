// API Configuration
const API_BASE_URL = 'https://open.er-api.com/v6/latest';

// Monedas disponibles
export const currencies = [
  // Monedas principales
  { code: 'USD', name: 'Dólar Estadounidense', country: 'us', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', country: 'eu', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', country: 'gb', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen Japonés', country: 'jp', flag: '🇯🇵' },
  { code: 'CHF', name: 'Franco Suizo', country: 'ch', flag: '🇨🇭' },
  { code: 'CAD', name: 'Dólar Canadiense', country: 'ca', flag: '🇨🇦' },
  { code: 'AUD', name: 'Dólar Australiano', country: 'au', flag: '🇦🇺' },
  { code: 'NZD', name: 'Dólar Neozelandés', country: 'nz', flag: '🇳🇿' },
  
  // Monedas asiáticas
  { code: 'CNY', name: 'Yuan Chino', country: 'cn', flag: '🇨🇳' },
  { code: 'KRW', name: 'Won Surcoreano', country: 'kr', flag: '🇰🇷' },
  { code: 'SGD', name: 'Dólar de Singapur', country: 'sg', flag: '🇸🇬' },
  { code: 'HKD', name: 'Dólar de Hong Kong', country: 'hk', flag: '🇭🇰' },
  { code: 'THB', name: 'Baht Tailandés', country: 'th', flag: '🇹🇭' },
  { code: 'INR', name: 'Rupia India', country: 'in', flag: '🇮🇳' },
  
  // Monedas latinoamericanas
  { code: 'ARS', name: 'Peso Argentino', country: 'ar', flag: '🇦🇷' },
  { code: 'BRL', name: 'Real Brasileño', country: 'br', flag: '🇧🇷' },
  { code: 'MXN', name: 'Peso Mexicano', country: 'mx', flag: '🇲🇽' },
  { code: 'CLP', name: 'Peso Chileno', country: 'cl', flag: '🇨🇱' },
  { code: 'COP', name: 'Peso Colombiano', country: 'co', flag: '🇨🇴' },
  { code: 'PEN', name: 'Sol Peruano', country: 'pe', flag: '🇵🇪' },
  { code: 'UYU', name: 'Peso Uruguayo', country: 'uy', flag: '🇺🇾' },
  
  // Monedas europeas
  { code: 'NOK', name: 'Corona Noruega', country: 'no', flag: '🇳🇴' },
  { code: 'SEK', name: 'Corona Sueca', country: 'se', flag: '🇸🇪' },
  { code: 'DKK', name: 'Corona Danesa', country: 'dk', flag: '🇩🇰' },
  { code: 'PLN', name: 'Zloty Polaco', country: 'pl', flag: '🇵🇱' },
  { code: 'CZK', name: 'Corona Checa', country: 'cz', flag: '🇨🇿' },
  { code: 'RUB', name: 'Rublo Ruso', country: 'ru', flag: '🇷🇺' },
  { code: 'TRY', name: 'Lira Turca', country: 'tr', flag: '🇹🇷' },
  
  // Monedas africanas
  { code: 'ZAR', name: 'Rand Sudafricano', country: 'za', flag: '🇿🇦' },
  { code: 'NGN', name: 'Naira Nigeriana', country: 'ng', flag: '🇳🇬' },
  { code: 'EGP', name: 'Libra Egipcia', country: 'eg', flag: '🇪🇬' },
];

/**
 * Obtener tasas de cambio desde la API
 */
export async function fetchExchangeRates(baseCurrency = 'USD') {
  try {
    const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener las tasas de cambio: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'Error desconocido al obtener tasas de cambio');
    }
    
    return data.rates;
  } catch (error) {
    console.error('Error al obtener las tasas de cambio:', error);
    throw error;
  }
}

/**
 * Convertir una cantidad de una moneda a otra
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const rates = await fetchExchangeRates(fromCurrency);
    
    if (!rates[toCurrency]) {
      throw new Error(`No se encontró la tasa de cambio para ${toCurrency}`);
    }
    
    const convertedAmount = amount * rates[toCurrency];
    const exchangeRate = rates[toCurrency];
    
    return {
      convertedAmount,
      exchangeRate,
      fromCurrency,
      toCurrency
    };
  } catch (error) {
    console.error('Error en la conversión:', error);
    throw error;
  }
}

/**
 * Obtener URL de bandera para una moneda
 */
export function getFlagUrl(currencyCode) {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return '';
  return `https://flagcdn.com/w80/${currency.country}.png`;
}

/**
 * Obtener información de moneda
 */
export function getCurrencyInfo(currencyCode) {
  return currencies.find(c => c.code === currencyCode);
}

export default {
  currencies,
  fetchExchangeRates,
  convertCurrency,
  getFlagUrl,
  getCurrencyInfo
};
