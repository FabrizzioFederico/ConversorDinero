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
 * @param {boolean} applyArgentineTaxes - Si aplicar impuestos argentinos (solo para ARS a USD/EUR)
 * @param {boolean} isGaming - Si es compra gaming (exime impuesto a las ganancias)
 * @returns {Object} - Objeto con cantidad convertida, impuestos aplicados y desglose
 */
function convertCurrency(amount, fromCurrency, toCurrency, rates, applyArgentineTaxes = false, isGaming = false) {
    // Si las monedas son iguales, no hay conversión
    if (fromCurrency === toCurrency) {
        return {
            convertedAmount: amount,
            baseAmount: amount,
            taxes: {},
            totalTaxes: 0,
            breakdown: {
                base: amount,
                taxes: {},
                total: amount
            }
        };
    }
    
    // Verificar que las tasas existen
    if (!rates) {
        throw new Error('No hay tasas de cambio disponibles');
    }
    
    let baseConvertedAmount = 0;
    
    // Realizar conversión base
    if (fromCurrency === 'USD') {
        if (!rates[toCurrency]) {
            throw new Error(`Tasa de cambio no disponible para ${toCurrency}`);
        }
        baseConvertedAmount = amount * rates[toCurrency];
    } else if (toCurrency === 'USD') {
        if (!rates[fromCurrency]) {
            throw new Error(`Tasa de cambio no disponible para ${fromCurrency}`);
        }
        baseConvertedAmount = amount / rates[fromCurrency];
    } else {
        // Para conversión entre dos monedas que no son USD
        if (!rates[fromCurrency] || !rates[toCurrency]) {
            throw new Error(`Tasas de cambio no disponibles para ${fromCurrency} o ${toCurrency}`);
        }
        const usdAmount = amount / rates[fromCurrency];
        baseConvertedAmount = usdAmount * rates[toCurrency];
    }
    
    // Aplicar impuestos argentinos si corresponde (solo USD/EUR a ARS)
    let finalAmount = baseConvertedAmount;
    let appliedTaxes = {};
    let totalTaxes = 0;
    
    if (applyArgentineTaxes && (fromCurrency === 'USD' || fromCurrency === 'EUR') && toCurrency === 'ARS') {
        const taxData = getCurrentTaxes();
        if (taxData.length > 0) {
            let taxMultiplier = 1;
            
            taxData.forEach(tax => {
                const taxValue = parseFloat(tax.valor);
                
                // Aplicar IVA siempre
                if (tax.impuesto.toLowerCase() === 'iva') {
                    const taxAmount = baseConvertedAmount * taxValue;
                    appliedTaxes.iva = {
                        rate: taxValue,
                        amount: taxAmount,
                        description: 'IVA (21%)'
                    };
                    taxMultiplier += taxValue;
                    totalTaxes += taxAmount;
                }
                
                // Aplicar Ganancias solo si no es gaming
                if (tax.impuesto.toLowerCase() === 'ganancias' && !isGaming) {
                    const taxAmount = baseConvertedAmount * taxValue;
                    appliedTaxes.ganancias = {
                        rate: taxValue,
                        amount: taxAmount,
                        description: 'Impuesto a las Ganancias (30%)'
                    };
                    taxMultiplier += taxValue;
                    totalTaxes += taxAmount;
                }
            });
            
            finalAmount = baseConvertedAmount * taxMultiplier;
        }
    }
    
    return {
        convertedAmount: finalAmount,
        baseAmount: baseConvertedAmount,
        taxes: appliedTaxes,
        totalTaxes: totalTaxes,
        breakdown: {
            base: baseConvertedAmount,
            taxes: appliedTaxes,
            total: finalAmount
        },
        hasArgentineTaxes: Object.keys(appliedTaxes).length > 0,
        isGamingPurchase: isGaming
    };
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
 * Función para obtener los impuestos argentinos actuales (estáticos)
 * @returns {Array} Array de impuestos con estructura {impuesto, valor}
 */
function getCurrentTaxes() {
    return ARGENTINE_TAXES;
}

/**
 * Función para calcular el total de impuestos a aplicar
 * @param {number} baseAmount - Monto base sin impuestos
 * @param {boolean} isGaming - Si es compra gaming (exime ganancias)
 * @returns {Object} Objeto con desglose de impuestos
 */
function calculateArgentineTaxes(baseAmount, isGaming = false) {
    const taxes = getCurrentTaxes();
    let totalTaxAmount = 0;
    let appliedTaxes = {};
    
    taxes.forEach(tax => {
        const taxValue = parseFloat(tax.valor);
        
        // Aplicar IVA siempre
        if (tax.impuesto.toLowerCase() === 'iva') {
            const taxAmount = baseAmount * taxValue;
            appliedTaxes.iva = {
                rate: taxValue,
                amount: taxAmount,
                description: 'IVA (21%)',
                applied: true
            };
            totalTaxAmount += taxAmount;
        }
        
        // Aplicar Ganancias solo si no es gaming
        if (tax.impuesto.toLowerCase() === 'ganancias') {
            const taxAmount = baseAmount * taxValue;
            appliedTaxes.ganancias = {
                rate: taxValue,
                amount: taxAmount,
                description: 'Imp. Ganancias (30%)',
                applied: !isGaming,
                exemptReason: isGaming ? 'Compra gaming' : null
            };
            
            if (!isGaming) {
                totalTaxAmount += taxAmount;
            }
        }
    });
    
    return {
        taxes: appliedTaxes,
        totalTaxAmount: totalTaxAmount,
        finalAmount: baseAmount + totalTaxAmount
    };
}

/**
 * Función para formatear el desglose de impuestos para mostrar
 * @param {Object} taxBreakdown - Objeto con desglose de impuestos
 * @param {string} currency - Moneda para formatear
 * @returns {string} Texto formateado del desglose
 */
function formatTaxBreakdown(taxBreakdown, currency = 'USD') {
    if (!taxBreakdown || Object.keys(taxBreakdown.taxes).length === 0) {
        return '';
    }
    
    let breakdown = [];
    
    Object.values(taxBreakdown.taxes).forEach(tax => {
        if (tax.applied) {
            breakdown.push(`${tax.description}: ${tax.amount.toFixed(2)} ${currency}`);
        } else if (tax.exemptReason) {
            breakdown.push(`${tax.description}: Exento (${tax.exemptReason})`);
        }
    });
    
    if (breakdown.length > 0) {
        breakdown.push(`Total impuestos: ${taxBreakdown.totalTaxAmount.toFixed(2)} ${currency}`);
    }
    
    return breakdown.join('\n');
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

// ===== NEWS API CONFIGURATION =====

// Configuración de la API de noticias
const NEWS_API_BASE_URL = 'https://api.rss2json.com/v1/api.json';
// URL RSS corregida de Ámbito Financiero
const AMBITO_RSS_URL = 'https://www.ambito.com/rss/pages/finanzas.xml';

// ===== TAX CONFIGURATION =====

// Impuestos argentinos estáticos
const ARGENTINE_TAXES = [
    { impuesto: 'iva', valor: '0.21' },        // 21%
    { impuesto: 'ganancias', valor: '0.30' }   // 30%
];

// Cache para noticias
let newsCache = {
    data: [],
    lastFetch: null,
    maxAge: 10 * 60 * 1000 // 10 minutos en millisegundos
};

/**
 * Función para obtener noticias financieras de Ámbito
 * @returns {Promise<Array>} Array de noticias con los campos: title, link, description, thumbnail, pubDate, author
 */
async function fetchFinancialNews() {
    try {
        // Verificar si hay cache válido
        const now = Date.now();
        if (newsCache.data.length > 0 && 
            newsCache.lastFetch && 
            (now - newsCache.lastFetch) < newsCache.maxAge) {
            console.log('📰 Noticias obtenidas desde cache');
            return newsCache.data;
        }

        console.log('📰 Obteniendo noticias financieras de Ámbito...');
        
        // Usar la API sin API key (sin parámetro count)
        const response = await fetch(`${NEWS_API_BASE_URL}?rss_url=${encodeURIComponent(AMBITO_RSS_URL)}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`Error en RSS2JSON: ${data.message || 'Error desconocido'}`);
        }
        
        // Procesar y limpiar los datos de noticias
        const processedNews = data.items.map(item => {
            // Limpiar HTML del description
            const cleanDescription = (item.description || '')
                .replace(/<[^>]*>/g, '') // Remover tags HTML
                .replace(/&nbsp;/g, ' ') // Reemplazar &nbsp;
                .replace(/&amp;/g, '&') // Reemplazar &amp;
                .replace(/&quot;/g, '"') // Reemplazar &quot;
                .replace(/&apos;/g, "'") // Reemplazar &apos;
                .replace(/&lt;/g, '<') // Reemplazar &lt;
                .replace(/&gt;/g, '>') // Reemplazar &gt;
                .trim();

            // Extraer imagen thumbnail (si existe)
            let thumbnail = item.thumbnail || item.enclosure?.link || null;
            
            // Si no hay thumbnail, buscar en el content
            if (!thumbnail && item.content) {
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                    thumbnail = imgMatch[1];
                }
            }

            return {
                title: item.title?.trim() || 'Sin título',
                link: item.link || '#',
                description: cleanDescription || 'Sin descripción disponible',
                thumbnail: thumbnail,
                pubDate: item.pubDate || new Date().toISOString(),
                author: item.author || 'Ámbito Financiero',
                guid: item.guid || item.link, // ID único para la noticia
                categories: item.categories || []
            };
        });

        // Actualizar cache
        newsCache.data = processedNews;
        newsCache.lastFetch = now;
        
        console.log(`📰 ${processedNews.length} noticias obtenidas exitosamente`);
        return processedNews;
        
    } catch (error) {
        console.error('❌ Error al obtener noticias:', error);
        
        // En caso de error, devolver cache si existe
        if (newsCache.data.length > 0) {
            console.log('📰 Devolviendo noticias desde cache debido a error');
            return newsCache.data;
        }
        
        // Si no hay cache, lanzar error para que no se muestren noticias
        throw error;
    }
}

/**
 * Función para obtener una noticia específica por ID
 * @param {string} guid - ID único de la noticia
 * @returns {Object|null} Noticia encontrada o null
 */
function getNewsById(guid) {
    return newsCache.data.find(news => news.guid === guid) || null;
}

/**
 * Función para filtrar noticias por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Array} Noticias filtradas
 */
function getNewsByCategory(category) {
    return newsCache.data.filter(news => 
        news.categories.some(cat => 
            cat.toLowerCase().includes(category.toLowerCase())
        )
    );
}

/**
 * Función para buscar noticias por palabra clave
 * @param {string} keyword - Palabra clave a buscar
 * @returns {Array} Noticias que contienen la palabra clave
 */
function searchNews(keyword) {
    const searchTerm = keyword.toLowerCase();
    return newsCache.data.filter(news => 
        news.title.toLowerCase().includes(searchTerm) ||
        news.description.toLowerCase().includes(searchTerm)
    );
}

/**
 * Función para obtener las últimas N noticias
 * @param {number} count - Número de noticias a obtener (default: 5)
 * @returns {Array} Últimas noticias
 */
function getLatestNews(count = 5) {
    return newsCache.data.slice(0, count);
}

/**
 * Función para limpiar el cache de noticias
 */
function clearNewsCache() {
    newsCache.data = [];
    newsCache.lastFetch = null;
    console.log('📰 Cache de noticias limpiado');
}

/**
 * Función para formatear fecha de publicación
 * @param {string} pubDate - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatNewsDate(pubDate) {
    try {
        const date = new Date(pubDate);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Hace unos minutos';
        } else if (diffInHours < 24) {
            return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) {
                return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
            } else {
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    } catch (error) {
        return 'Fecha no disponible';
    }
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
        startAutoUpdate,
        // Funciones de impuestos argentinos
        getCurrentTaxes,
        calculateArgentineTaxes,
        formatTaxBreakdown
    };

    // Agregar funciones de noticias al objeto global
    window.NewsAPI = {
        fetchFinancialNews,
        getNewsById,
        getNewsByCategory,
        searchNews,
        getLatestNews,
        clearNewsCache,
        formatNewsDate
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
        currencies,
        // Tax functions
        getCurrentTaxes,
        calculateArgentineTaxes,
        formatTaxBreakdown,
        // News API functions
        fetchFinancialNews,
        getNewsById,
        getNewsByCategory,
        searchNews,
        getLatestNews,
        clearNewsCache,
        formatNewsDate
    };
}
