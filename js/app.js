// Elementos del DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const cancelEditButton = document.getElementById('cancelEditButton');
const swapButton = document.getElementById('swapButton');
const resultDiv = document.getElementById('result');
const convertedAmountSpan = document.getElementById('convertedAmount');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('closeMenu');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const exchangeRateValue = document.getElementById('exchangeRateValue');
const gamingCheckbox = document.getElementById('gamingCheckbox');
const argentineTaxContainer = document.getElementById('argentineTaxContainer');
// Función para calcular items por página basado en el tamaño de pantalla
function calculateItemsPerPage() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Mobile: pantallas pequeñas
    if (width <= 768) {
        return 6;
    }
    
    // Tablets en modo portrait o laptops pequeñas
    if (width <= 1024 || height <= 768) {
        return 4;
    }
    
    // Desktop/laptops grandes: pantallas más grandes
    if (width <= 1440) {
        return 6;
    }
    
    // Pantallas muy grandes (4K, ultrawide, etc.)
    return 8;
}

let ITEMS_PER_PAGE = calculateItemsPerPage();
let currentPage = 1;
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const paginationContainer = document.querySelector('.pagination');

// Estado de la aplicación
let isLoading = false;
let isDarkMode = false;
let currentEditId = null;
let lastConversionData = null; // Para guardar la última conversión realizada
let isReconvertingWithGaming = false; // Flag para indicar reconversión por cambio de gaming

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
        const flagUrl = window.CurrencyAPI.getFlagUrl(currency.code);
        
        // Crear opción con bandera y código
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = currency.code;
        option1.setAttribute('data-flag', flagUrl);
        fromCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency.code;
        option2.textContent = currency.code;
        option2.setAttribute('data-flag', flagUrl);
        toCurrencySelect.appendChild(option2);
    });
    
    // Establecer valores por defecto
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
    
    // Aplicar estilos personalizados a los selectores
    customizeSelectWithFlags();
}

/**
 * Función para personalizar los selectores con banderas
 */
function customizeSelectWithFlags() {
    // Crear elementos de bandera
    createFlagDisplays();
    
    // Actualizar banderas cuando cambian los selectores
    fromCurrencySelect.addEventListener('change', updateFromFlag);
    toCurrencySelect.addEventListener('change', updateToFlag);
    
    // Inicializar banderas
    updateFromFlag();
    updateToFlag();
}

/**
 * Función para crear los elementos de visualización de banderas
 */
function createFlagDisplays() {
    // Envolver el selector de origen en un contenedor con bandera
    if (!document.getElementById('fromContainer')) {
        const fromContainer = document.createElement('div');
        fromContainer.id = 'fromContainer';
        fromContainer.className = 'currency-container';
        
        const fromFlag = document.createElement('img');
        fromFlag.id = 'fromFlag';
        fromFlag.className = 'currency-flag';
        fromFlag.width = 24;
        fromFlag.height = 18;
        
        // Mover el selector al contenedor
        fromCurrencySelect.parentNode.insertBefore(fromContainer, fromCurrencySelect);
        fromContainer.appendChild(fromFlag);
        fromContainer.appendChild(fromCurrencySelect);
    }
    
    // Envolver el selector de destino en un contenedor con bandera
    if (!document.getElementById('toContainer')) {
        const toContainer = document.createElement('div');
        toContainer.id = 'toContainer';
        toContainer.className = 'currency-container';
        
        const toFlag = document.createElement('img');
        toFlag.id = 'toFlag';
        toFlag.className = 'currency-flag';
        toFlag.width = 24;
        toFlag.height = 18;
        
        // Mover el selector al contenedor
        toCurrencySelect.parentNode.insertBefore(toContainer, toCurrencySelect);
        toContainer.appendChild(toFlag);
        toContainer.appendChild(toCurrencySelect);
    }
}

/**
 * Función para actualizar la visualización del tipo de cambio
 */
async function updateExchangeRateDisplay() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (!fromCurrency || !toCurrency) {
        exchangeRateValue.textContent = '1 USD = 1.00 EUR';
        return;
    }
    
    try {
        // Obtener tasas actuales
        const rates = await window.CurrencyAPI.fetchExchangeRates('USD');
        
        // Calcular el tipo de cambio entre las monedas seleccionadas (sin impuestos para la visualización)
        const exchangeRateResult = window.CurrencyAPI.convertCurrency(1, fromCurrency, toCurrency, rates, false, false);
        
        // Extraer el valor numérico del tipo de cambio
        const exchangeRate = typeof exchangeRateResult === 'number' ? exchangeRateResult : exchangeRateResult.baseAmount;
        
        // Obtener símbolos de moneda si están disponibles
        const fromInfo = window.CurrencyAPI.getCurrencyInfo(fromCurrency);
        const toInfo = window.CurrencyAPI.getCurrencyInfo(toCurrency);
        
        // Formatear el tipo de cambio con el número apropiado de decimales
        let formattedRate;
        if (exchangeRate >= 1) {
            formattedRate = exchangeRate.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            });
        } else {
            formattedRate = exchangeRate.toLocaleString('es-ES', {
                minimumFractionDigits: 4,
                maximumFractionDigits: 6
            });
        }
        
        // Actualizar el texto del tipo de cambio
        exchangeRateValue.textContent = `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
        
    } catch (error) {
        console.error('Error al actualizar tipo de cambio:', error);
        exchangeRateValue.textContent = `1 ${fromCurrency} = -- ${toCurrency}`;
    }
}

/**
 * Función para actualizar la bandera de la moneda de origen
 */
function updateFromFlag() {
    const flagElement = document.getElementById('fromFlag');
    const flagUrl = window.CurrencyAPI.getFlagUrl(fromCurrencySelect.value);
    const currencyInfo = window.CurrencyAPI.getCurrencyInfo(fromCurrencySelect.value);
    
    if (flagElement && flagUrl && currencyInfo) {
        flagElement.src = flagUrl;
        flagElement.alt = currencyInfo.name;
        flagElement.title = `${fromCurrencySelect.value} - ${currencyInfo.name}`;
    }
    
    // Actualizar tipo de cambio cuando cambia la moneda de origen
    updateExchangeRateDisplay();
    
    // Mostrar/ocultar controles de impuestos argentinos
    updateArgentineTaxControls();
}

/**
 * Función para actualizar la bandera de la moneda de destino
 */
function updateToFlag() {
    const flagElement = document.getElementById('toFlag');
    const flagUrl = window.CurrencyAPI.getFlagUrl(toCurrencySelect.value);
    const currencyInfo = window.CurrencyAPI.getCurrencyInfo(toCurrencySelect.value);
    
    if (flagElement && flagUrl && currencyInfo) {
        flagElement.src = flagUrl;
        flagElement.alt = currencyInfo.name;
        flagElement.title = `${toCurrencySelect.value} - ${currencyInfo.name}`;
    }
    
    // Actualizar tipo de cambio cuando cambia la moneda de destino
    updateExchangeRateDisplay();
    
    // Mostrar/ocultar controles de impuestos argentinos
    updateArgentineTaxControls();
}

/**
 * Función para mostrar/ocultar los controles de impuestos argentinos
 */
function updateArgentineTaxControls() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Mostrar controles solo si convertimos de USD o EUR a ARS
    const shouldShowTaxControls = (fromCurrency === 'USD' || fromCurrency === 'EUR') && toCurrency === 'ARS';
    
    if (argentineTaxContainer) {
        if (shouldShowTaxControls) {
            argentineTaxContainer.style.display = 'block';
            argentineTaxContainer.classList.add('tax-controls-visible');
        } else {
            argentineTaxContainer.style.display = 'none';
            argentineTaxContainer.classList.remove('tax-controls-visible');
        }
    }
}

/**
 * Función para mostrar el resultado de la conversión
 * @param {number} amount - Cantidad original
 * @param {string} fromCurrency - Moneda de origen
 * @param {string} toCurrency - Moneda de destino
 * @param {Object} conversionResult - Resultado de la conversión con impuestos
 */
function displayResult(amount, fromCurrency, toCurrency, conversionResult) {
    // Si el resultado es un número simple (conversión sin impuestos)
    let finalAmount, baseAmount, hasArgentineTaxes, taxBreakdown;
    
    if (typeof conversionResult === 'number') {
        finalAmount = conversionResult;
        baseAmount = conversionResult;
        hasArgentineTaxes = false;
        taxBreakdown = null;
    } else {
        finalAmount = conversionResult.convertedAmount;
        baseAmount = conversionResult.baseAmount;
        hasArgentineTaxes = conversionResult.hasArgentineTaxes;
        taxBreakdown = conversionResult.breakdown;
    }
    
    const formattedFinalAmount = finalAmount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const originalFormatted = amount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Crear el texto principal del resultado
    let resultText = `${originalFormatted} ${fromCurrency} = ${formattedFinalAmount} ${toCurrency}`;
    
    // Agregar desglose de impuestos solo si es USD→ARS o EUR→ARS
    if (hasArgentineTaxes && taxBreakdown && toCurrency === 'ARS' && (fromCurrency === 'USD' || fromCurrency === 'EUR')) {
        const baseFormatted = baseAmount.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Calcular impuestos totales correctamente (diferencia entre total y base)
        const totalTaxes = finalAmount - baseAmount;
        
        const totalTaxesFormatted = totalTaxes.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Para USD→ARS y EUR→ARS, mostrar solo el desglose sin la línea de conversión
        resultText = `Sin impuestos\n$ ${baseFormatted}\n\nImpuestos totales\n$ ${totalTaxesFormatted}\n\nTotal\n$ ${formattedFinalAmount}`;
        
        // No agregar clase especial - mantener el estilo normal
    } else {
        // Remover clase especial si no es desglose argentino (por compatibilidad)
        convertedAmountSpan.classList.remove('argentine-breakdown');
    }
    
    convertedAmountSpan.textContent = resultText;
    
    // Remover clases de estado anterior
    convertedAmountSpan.classList.remove('error-text');
    convertedAmountSpan.style.color = ''; // Limpiar estilos inline
    
    resultDiv.style.display = 'block';
    
    // Agregar animación de resultado
    resultDiv.classList.add('result-animation');
    setTimeout(() => {
        resultDiv.classList.remove('result-animation');
    }, 500);
    
    // Auto-limpiar el estado después de 1 segundo si no fue una reconversión por gaming
    // Esto asegura que la próxima conversión siempre sea nueva
    if (!isReconvertingWithGaming) {
        setTimeout(() => {
            clearConversionState();
        }, 1000); // Reducido de 3 segundos a 1 segundo para restablecimiento más rápido
    }
}

/**
 * Función para mostrar errores
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    convertedAmountSpan.textContent = message;
    convertedAmountSpan.classList.add('error-text');
    convertedAmountSpan.style.color = ''; // Limpiar estilos inline
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
    convertedAmountSpan.classList.remove('error-text');
    convertedAmountSpan.style.color = ''; // Limpiar estilos inline
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
        
    // Verificar si se deben aplicar impuestos argentinos
    const shouldApplyArgentineTaxes = (fromCurrency === 'USD' || fromCurrency === 'EUR') && toCurrency === 'ARS';
    const isGaming = gamingCheckbox ? gamingCheckbox.checked : false;
    
    // Verificar si es una nueva conversión diferente
    const isNewConversion = !lastConversionData || 
                           lastConversionData.amount !== amount ||
                           lastConversionData.fromCurrency !== fromCurrency ||
                           lastConversionData.toCurrency !== toCurrency;
    
    // Si es una nueva conversión, limpiar datos previos
    if (isNewConversion) {
        lastConversionData = null;
    }        // Cargar impuestos argentinos si es necesario
        if (shouldApplyArgentineTaxes) {
            try {
                await window.CurrencyAPI.fetchArgentineTaxes();
            } catch (error) {
                console.warn('⚠️ Error al cargar impuestos, usando valores por defecto');
            }
        }
        
        // Realizar conversión con o sin impuestos
        const conversionResult = window.CurrencyAPI.convertCurrency(
            amount, 
            fromCurrency, 
            toCurrency, 
            rates,
            shouldApplyArgentineTaxes,
            isGaming
        );
        
        // Guardar datos de la conversión actual
        lastConversionData = {
            amount,
            fromCurrency,
            toCurrency,
            shouldApplyArgentineTaxes,
            isGaming,
            conversionResult,
            rates
        };
        
        // Mostrar resultado
        displayResult(amount, fromCurrency, toCurrency, conversionResult);
        
        // Extraer el monto final para el historial
        const finalAmount = typeof conversionResult === 'number' ? conversionResult : conversionResult.convertedAmount;
        
        // Agregar al historial
        saveToHistory(amount, fromCurrency, toCurrency, finalAmount, shouldApplyArgentineTaxes, isGaming);
        
        // Limpiar inmediatamente después de guardar para asegurar que la próxima sea nueva conversión
        setTimeout(() => {
            clearConversionState();
        }, 500); // Pequeño delay para permitir cualquier reconversión inmediata por gaming
        
    } catch (error) {
        console.error('Error en la conversión:', error);
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Función para conversión en tiempo real (sin guardar en historial)
 */
async function performRealtimeConversion() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Si no hay cantidad válida, ocultar resultado
    if (!amount || amount <= 0) {
        resultDiv.style.display = 'none';
        return;
    }
    
    // Si no hay monedas seleccionadas, no hacer nada
    if (!fromCurrency || !toCurrency) {
        return;
    }
    
    try {
        // Obtener tasas de cambio actuales
        const rates = await window.CurrencyAPI.fetchExchangeRates('USD');
        
        // Verificar si se deben aplicar impuestos argentinos
        const shouldApplyArgentineTaxes = (fromCurrency === 'USD' || fromCurrency === 'EUR') && toCurrency === 'ARS';
        const isGaming = gamingCheckbox ? gamingCheckbox.checked : false;
        
        // Cargar impuestos argentinos si es necesario
        if (shouldApplyArgentineTaxes) {
            try {
                await window.CurrencyAPI.fetchArgentineTaxes();
            } catch (error) {
                console.warn('⚠️ Error al cargar impuestos, usando valores por defecto');
            }
        }
        
        // Realizar conversión con o sin impuestos
        const conversionResult = window.CurrencyAPI.convertCurrency(
            amount, 
            fromCurrency, 
            toCurrency, 
            rates,
            shouldApplyArgentineTaxes,
            isGaming
        );
        
        // Guardar datos de la conversión actual para posible guardado
        lastConversionData = {
            amount,
            fromCurrency,
            toCurrency,
            shouldApplyArgentineTaxes,
            isGaming,
            conversionResult,
            rates
        };
        
        // Mostrar resultado sin guardarlo
        displayRealtimeResult(amount, fromCurrency, toCurrency, conversionResult);
        
        // Mostrar/ocultar controles de impuestos argentinos
        if (shouldApplyArgentineTaxes && argentineTaxContainer) {
            argentineTaxContainer.style.display = 'block';
        } else if (argentineTaxContainer) {
            argentineTaxContainer.style.display = 'none';
        }
        
        console.log('🔄 Conversión en tiempo real realizada');
        
    } catch (error) {
        console.error('Error en la conversión en tiempo real:', error);
        showError(`Error: ${error.message}`);
    }
}

/**
 * Función para mostrar resultado en tiempo real (sin auto-reset)
 */
function displayRealtimeResult(amount, fromCurrency, toCurrency, conversionResult) {
    // Si el resultado es un número simple (conversión sin impuestos)
    let finalAmount, baseAmount, hasArgentineTaxes, taxBreakdown;
    
    if (typeof conversionResult === 'number') {
        finalAmount = conversionResult;
        baseAmount = conversionResult;
        hasArgentineTaxes = false;
        taxBreakdown = null;
    } else {
        finalAmount = conversionResult.convertedAmount;
        baseAmount = conversionResult.baseAmount;
        hasArgentineTaxes = conversionResult.hasArgentineTaxes;
        taxBreakdown = conversionResult.breakdown;
    }
    
    const formattedFinalAmount = finalAmount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const originalFormatted = amount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Crear el texto principal del resultado
    let resultText = `${originalFormatted} ${fromCurrency} = ${formattedFinalAmount} ${toCurrency}`;
    
    // Agregar desglose de impuestos solo si es USD→ARS o EUR→ARS
    if (hasArgentineTaxes && taxBreakdown && toCurrency === 'ARS' && (fromCurrency === 'USD' || fromCurrency === 'EUR')) {
        const baseFormatted = baseAmount.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Calcular impuestos totales correctamente (diferencia entre total y base)
        const totalTaxes = finalAmount - baseAmount;
        
        const totalTaxesFormatted = totalTaxes.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Para USD→ARS y EUR→ARS, mostrar solo el desglose sin la línea de conversión
        resultText = `Sin impuestos\n$ ${baseFormatted}\n\nImpuestos totales\n$ ${totalTaxesFormatted}\n\nTotal\n$ ${formattedFinalAmount}`;
        
        // No agregar clase especial - mantener el estilo normal
    } else {
        // Remover clase especial si no es desglose argentino (por compatibilidad)
        convertedAmountSpan.classList.remove('argentine-breakdown');
    }
    
    convertedAmountSpan.textContent = resultText;
    
    // Remover clases de estado anterior
    convertedAmountSpan.classList.remove('error-text');
    convertedAmountSpan.style.color = '';
    
    // Verificar si el resultado ya está visible
    const isCurrentlyVisible = resultDiv.style.display === 'block' && resultDiv.classList.contains('show');
    
    if (!isCurrentlyVisible) {
        // Si no está visible, mostrar con animación de entrada
        resultDiv.style.display = 'block';
        resultDiv.classList.remove('result-slide-out', 'result-update');
        resultDiv.classList.add('result-slide-in');
        
        // Agregar la clase 'show' después de un breve delay para sincronizar la animación
        setTimeout(() => {
            resultDiv.classList.add('show');
        }, 10);
        
        // Limpiar la clase de animación después de que termine
        setTimeout(() => {
            resultDiv.classList.remove('result-slide-in');
        }, 400);
    } else {
        // Si ya está visible, hacer una animación de actualización sutil
        resultDiv.classList.remove('result-slide-in', 'result-slide-out');
        resultDiv.classList.add('result-update');
        
        // Limpiar la clase de animación después de que termine
        setTimeout(() => {
            resultDiv.classList.remove('result-update');
        }, 300);
    }
    
    // NO hay auto-reset para conversión en tiempo real
}

/**
 * Función para guardar conversión en historial (nueva función del botón)
 */
async function saveConversion() {
    // Verificar que hay una conversión en lastConversionData
    if (!lastConversionData) {
        showError('Primero ingrese una cantidad para convertir');
        return;
    }
    
    const { amount, fromCurrency, toCurrency, shouldApplyArgentineTaxes, isGaming, conversionResult } = lastConversionData;
    
    // Extraer el monto final para el historial
    const finalAmount = typeof conversionResult === 'number' ? conversionResult : conversionResult.convertedAmount;
    
    // Guardar en historial
    if (currentEditId) {
        // Si estamos editando, actualizar la entrada existente
        let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const editIndex = history.findIndex(item => item.id === currentEditId);
        if (editIndex !== -1) {
            history[editIndex] = {
                ...history[editIndex],
                amount,
                fromCurrency,
                toCurrency,
                result: finalAmount,
                hasArgentineTaxes: shouldApplyArgentineTaxes,
                isGaming,
                timestamp: new Date().toISOString()
            };
            
            // Limpiar el estado de edición
            currentEditId = null;
            convertButton.textContent = 'Guardar conversión';
            convertButton.classList.remove('editing');
            cancelEditButton.style.display = 'none';
            
            localStorage.setItem('conversionHistory', JSON.stringify(history));
            updateHistoryDisplay();
            
            // Mostrar confirmación de actualización
            showSaveConfirmation('Actualizado ✓');
            return;
        }
    } else {
        // Agregar nueva entrada al historial
        saveToHistory(amount, fromCurrency, toCurrency, finalAmount, shouldApplyArgentineTaxes, isGaming);
    }
    
    // Mostrar confirmación temporal
    showSaveConfirmation('Guardado ✓');
    
    console.log('💾 Conversión guardada en historial');
}

/**
 * Función para mostrar confirmación de guardado
 */
function showSaveConfirmation(message) {
    const originalText = convertButton.textContent;
    const originalColor = convertButton.style.backgroundColor;
    
    convertButton.textContent = message;
    convertButton.style.backgroundColor = '#27ae60';
    convertButton.disabled = true;
    
    setTimeout(() => {
        convertButton.textContent = originalText;
        convertButton.style.backgroundColor = originalColor;
        convertButton.disabled = false;
    }, 1500);
}

/**
 * Función para reconvertir en tiempo real cuando cambia el checkbox de gaming
 */
async function reconvertWithGamingState() {
    if (!lastConversionData || isLoading) return;
    
    const { amount, fromCurrency, toCurrency, shouldApplyArgentineTaxes, rates } = lastConversionData;
    const isGaming = gamingCheckbox ? gamingCheckbox.checked : false;
    
    try {
        // Verificar si la conversión actual debe aplicar impuestos
        if (!shouldApplyArgentineTaxes) {
            return; // No hacer nada si no se aplican impuestos
        }
        
        // Marcar que estamos reconvirtiendo por cambio de gaming
        isReconvertingWithGaming = true;
        
        // Realizar nueva conversión con el estado actual del checkbox
        const conversionResult = window.CurrencyAPI.convertCurrency(
            amount, 
            fromCurrency, 
            toCurrency, 
            rates,
            shouldApplyArgentineTaxes,
            isGaming
        );
        
        // Actualizar datos guardados
        lastConversionData.isGaming = isGaming;
        lastConversionData.conversionResult = conversionResult;
        
        // Mostrar resultado actualizado
        displayResult(amount, fromCurrency, toCurrency, conversionResult);
        
        // Extraer el monto final para actualizar el historial
        const finalAmount = typeof conversionResult === 'number' ? conversionResult : conversionResult.convertedAmount;
        
        // Actualizar en el historial (reemplazar la última entrada si es la misma conversión)
        updateLastHistoryEntry(amount, fromCurrency, toCurrency, finalAmount, shouldApplyArgentineTaxes, isGaming);
        
        // Limpiar inmediatamente después de actualizar para que la próxima sea nueva conversión
        setTimeout(() => {
            clearConversionState();
        }, 50); // Delay muy corto para asegurar que la actualización se complete
        
    } catch (error) {
        console.error('Error en la reconversión:', error);
        // Limpiar el estado incluso si hay error
        clearConversionState();
    }
}

/**
 * Función para intercambiar monedas (actualizada para tiempo real)
 */
function swapCurrencies() {
    if (isLoading) return;
    
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;
    
    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;
    
    // Actualizar banderas después del intercambio
    updateFromFlag();
    updateToFlag();
    
    // Actualizar tipo de cambio después del intercambio
    updateExchangeRateDisplay();
    
    // Agregar animación al botón de intercambio
    swapButton.classList.add('swap-animation');
    setTimeout(() => {
        swapButton.classList.remove('swap-animation');
    }, 300);
    
    // Si hay un valor en el input, reconvertir automáticamente en tiempo real
    if (amountInput.value.trim()) {
        clearConversionState();
        setTimeout(() => {
            performRealtimeConversion();
        }, 300);
    }
}

/**
 * Función para limpiar el estado de conversión anterior
 * Esto fuerza que la próxima conversión sea nueva en lugar de actualizar
 */
function clearConversionState() {
    const wasCleared = lastConversionData !== null || isReconvertingWithGaming !== false;
    lastConversionData = null;
    isReconvertingWithGaming = false;
    
    if (wasCleared) {
        console.log('🧹 Estado de conversión limpiado - próxima conversión será NUEVA entrada en historial');
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
    
    // Ocultar el botón hamburguesa cuando se abre el menú
    if (sidebar.classList.contains('active')) {
        menuToggle.classList.add('hidden');
    }
}

function closeMenuHandler() {
    menuToggle.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    
    // Mostrar el botón hamburguesa cuando se cierra el menú
    menuToggle.classList.remove('hidden');
}

// Funciones para el modo noche
function toggleTheme() {
    // Prevenir múltiples clics durante la transición
    if (document.body.classList.contains('theme-changing')) {
        return;
    }
    
    // Agregar clase de animación global tanto a html como a body
    document.documentElement.classList.add('theme-changing');
    document.body.classList.add('theme-changing');
    
    // Agregar animación al botón con mayor duración
    themeToggle.classList.add('rotating');
    
    // Transición más fluida con múltiples pasos
    setTimeout(() => {
        isDarkMode = !isDarkMode;
        
        // Aplicar el tema
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.querySelector('.theme-icon').textContent = '🌙';
            localStorage.setItem('darkMode', 'false');
        }
        
        console.log(`🎨 Tema cambiado a: ${isDarkMode ? 'Oscuro' : 'Claro'}`);
    }, 150); // Delay más corto para cambio más natural
    
    // Remover animaciones con timing optimizado
    setTimeout(() => {
        themeToggle.classList.remove('rotating');
    }, 600);
    
    setTimeout(() => {
        document.documentElement.classList.remove('theme-changing');
        document.body.classList.remove('theme-changing');
    }, 800); // Tiempo extendido para transición más suave
}

function loadTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    
    // Aplicar tema sin transición al cargar para evitar flash, pero con duración más corta
    document.documentElement.style.setProperty('--theme-transition-duration', '0.1s');
    
    if (savedTheme === 'true') {
        isDarkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
        isDarkMode = false;
        document.documentElement.removeAttribute('data-theme');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
    
    // Restaurar transiciones suaves después del primer frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.documentElement.style.removeProperty('--theme-transition-duration');
        });
    });
    
    console.log(`🎨 Tema cargado: ${isDarkMode ? 'Oscuro' : 'Claro'}`);
}

// Función para guardar en el historial
function saveToHistory(amount, fromCurrency, toCurrency, result, hasArgentineTaxes = false, isGaming = false) {
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    // Si estamos editando una conversión existente, actualizarla
    if (currentEditId) {
        const editIndex = history.findIndex(item => item.id === currentEditId);
        if (editIndex !== -1) {
            // Actualizar la conversión existente
            history[editIndex] = {
                ...history[editIndex],
                amount,
                fromCurrency,
                toCurrency,
                result,
                hasArgentineTaxes,
                isGaming,
                timestamp: new Date().toISOString()
            };
            
            // Limpiar el estado de edición y conversión después de actualizar
            currentEditId = null;
            lastConversionData = null;
            isReconvertingWithGaming = false;
            
            // Restaurar el botón de convertir
            convertButton.textContent = 'Convertir';
            convertButton.classList.remove('editing');
            cancelEditButton.style.display = 'none';
            
            localStorage.setItem('conversionHistory', JSON.stringify(history));
            updateHistoryDisplay();
            return;
        }
    }
    
    // Si no es una edición, crear nueva entrada
    const conversion = {
        id: Date.now(),
        amount,
        fromCurrency,
        toCurrency,
        result,
        hasArgentineTaxes,
        isGaming,
        timestamp: new Date().toISOString()
    };

    history.unshift(conversion);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Función para actualizar la última entrada del historial
function updateLastHistoryEntry(amount, fromCurrency, toCurrency, result, hasArgentineTaxes = false, isGaming = false) {
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    // Solo actualizar la entrada existente si estamos reconvirtiendo por cambio de gaming
    // y hay al menos una entrada con los mismos datos base
    if (isReconvertingWithGaming && history.length > 0) {
        const lastEntry = history[0];
        if (lastEntry.amount === amount && 
            lastEntry.fromCurrency === fromCurrency && 
            lastEntry.toCurrency === toCurrency) {
            
            // Actualizar solo el resultado, impuestos y gaming de la entrada existente
            lastEntry.result = result;
            lastEntry.hasArgentineTaxes = hasArgentineTaxes;
            lastEntry.isGaming = isGaming;
            lastEntry.timestamp = new Date().toISOString();
            
            localStorage.setItem('conversionHistory', JSON.stringify(history));
            updateHistoryDisplay();
            return;
        }
    }
    
    // En cualquier otro caso, crear nueva entrada
    saveToHistory(amount, fromCurrency, toCurrency, result, hasArgentineTaxes, isGaming);
}

// Función para actualizar el historial en el DOM
function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = history.slice(startIndex, endIndex);
    
    historyList.innerHTML = '';
    
    // Si no hay conversiones, mostrar mensaje y ocultar paginación
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="no-history-message">
                <p>No hay conversiones en el historial</p>
                <small>Las conversiones aparecerán aquí después de realizar una conversión</small>
            </div>
        `;
        // Ocultar paginación con transición suave
        paginationContainer.style.opacity = '0';
        paginationContainer.style.visibility = 'hidden';
        paginationContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
            paginationContainer.style.display = 'none';
        }, 300);
        return;
    }
    
    // Mostrar conversiones
    currentItems.forEach(conversion => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // Crear indicadores de impuestos si corresponde
        let taxIndicators = '';
        if (conversion.hasArgentineTaxes) {
            taxIndicators = `<span class="tax-indicator" title="Conversión con impuestos argentinos">🇦🇷 c/impuestos</span>`;
            if (conversion.isGaming) {
                taxIndicators += ` <span class="gaming-indicator" title="Compra gaming - Sin imp. ganancias">🎮</span>`;
            }
        }
        
        item.innerHTML = `
            <div class="conversion-details">
                ${Number(conversion.amount).toFixed(2)} ${conversion.fromCurrency} = 
                ${Number(conversion.result).toFixed(2)} ${conversion.toCurrency}
                ${taxIndicators ? `<br>${taxIndicators}` : ''}
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
    
    // Mostrar/ocultar paginación según sea necesario
    if (totalPages <= 1) {
        // Si solo hay una página o menos, ocultar paginación con transición suave
        paginationContainer.style.opacity = '0';
        paginationContainer.style.visibility = 'hidden';
        paginationContainer.style.transform = 'translateY(10px)';
        // Usar setTimeout para cambiar display después de la transición
        setTimeout(() => {
            if (totalPages <= 1) {
                paginationContainer.style.display = 'none';
            }
        }, 300);
    } else {
        // Si hay múltiples páginas, mostrar paginación con transición suave
        paginationContainer.style.display = 'flex';
        // Pequeño delay para permitir que display se aplique antes de la transición
        setTimeout(() => {
            paginationContainer.style.opacity = '1';
            paginationContainer.style.visibility = 'visible';
            paginationContainer.style.transform = 'translateY(0)';
        }, 10);
        
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
}

// Funciones para cambiar de página
function goToNextPage() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    
    if (currentPage < totalPages) {
        currentPage++;
        updateHistoryDisplay();
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateHistoryDisplay();
    }
}

// Agregar al final del DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ...código existente...
    
    // Event listeners para la paginación
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    
    updateHistoryDisplay();
});

// Modificar la función deleteConversion
function deleteConversion(id) {
    // Si se está eliminando la conversión que se está editando, cancelar la edición
    if (currentEditId === id) {
        cancelEdit();
    }
    
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    
    // Verificar si la página actual quedó vacía
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }
    
    updateHistoryDisplay();
}

// Modificar la función editConversion
function editConversion(id) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const conversion = history.find(item => item.id === id);
    
    if (conversion) {
        currentEditId = id;
        amountInput.value = conversion.amount;
        fromCurrencySelect.value = conversion.fromCurrency;
        toCurrencySelect.value = conversion.toCurrency;
        
        // Configurar checkbox de gaming si corresponde
        if (gamingCheckbox && conversion.hasArgentineTaxes) {
            gamingCheckbox.checked = conversion.isGaming || false;
        }
        
        // Cambiar el texto y estilo del botón de convertir
        convertButton.textContent = 'Actualizar';
        convertButton.classList.add('editing');
        
        // Mostrar el botón de cancelar
        cancelEditButton.style.display = 'block';
        
        // Actualizar banderas y tipo de cambio
        updateFromFlag();
        updateToFlag();
        
        // Cerrar el menú
        closeMenuHandler();
        
        // Enfocar el campo de cantidad
        amountInput.focus();
    }
}

// Nueva función para cancelar la edición
function cancelEdit() {
    // Resetear el estado de edición
    currentEditId = null;
    
    // Restaurar el botón de convertir
    convertButton.textContent = 'Convertir';
    convertButton.classList.remove('editing');
    
    // Ocultar el botón de cancelar
    cancelEditButton.style.display = 'none';
    
    // Limpiar datos de conversión anterior para forzar nueva entrada
    lastConversionData = null;
    isReconvertingWithGaming = false;
    
    // Limpiar el formulario
    clearForm();
    
    console.log('✅ Edición cancelada');
}

// Event Listeners y inicialización
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando Conversor de Moneda...');
    
    // Calcular items por página para la pantalla actual
    ITEMS_PER_PAGE = calculateItemsPerPage();
    console.log(`📱 Pantalla detectada: ${window.innerWidth}x${window.innerHeight} - ${ITEMS_PER_PAGE} elementos por página`);
    
    // Cargar tema guardado
    loadTheme();
    
    try {
        // Cargar monedas en los selectores
        loadCurrencies();
        console.log('✅ Monedas cargadas');
        
        // Obtener tasas iniciales
        await window.CurrencyAPI.fetchExchangeRates();
        console.log('✅ Tasas de cambio iniciales obtenidas');
        
        // Cargar impuestos argentinos
        try {
            await window.CurrencyAPI.fetchArgentineTaxes();
            console.log('✅ Impuestos argentinos cargados');
        } catch (error) {
            console.warn('⚠️ Error al cargar impuestos argentinos:', error);
        }
        
        // Actualizar tipo de cambio inicial
        await updateExchangeRateDisplay();
        console.log('✅ Tipo de cambio inicial mostrado');
        
        // Inicializar controles de impuestos argentinos
        updateArgentineTaxControls();
        
        // Iniciar actualización automática
        window.CurrencyAPI.startAutoUpdate(10);
        
        // Cargar última conversión si existe
        loadLastConversion();
        
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
        showError('Error al inicializar la aplicación. Verifique su conexión a internet.');
    }
    
    // Event listeners para botones
    convertButton.addEventListener('click', saveConversion); // Cambiado a saveConversion
    cancelEditButton.addEventListener('click', cancelEdit);
    swapButton.addEventListener('click', swapCurrencies);
    
    // Event listeners para cambios automáticos en tiempo real
    fromCurrencySelect.addEventListener('change', function() {
        clearConversionState(); // Limpiar estado al cambiar moneda origen
        updateFromFlag();
        updateExchangeRateDisplay();
        if (amountInput.value.trim()) {
            performRealtimeConversion(); // Conversión en tiempo real
        }
    });
    
    toCurrencySelect.addEventListener('change', function() {
        clearConversionState(); // Limpiar estado al cambiar moneda destino
        updateToFlag();
        updateExchangeRateDisplay();
        if (amountInput.value.trim()) {
            performRealtimeConversion(); // Conversión en tiempo real
        }
    });
    
    // Event listeners para el input
    amountInput.addEventListener('input', validateNumericInput);
    amountInput.addEventListener('input', formatInput);
    
    // Event listener para conversión en tiempo real mientras se escribe
    amountInput.addEventListener('input', function() {
        // Limpiar estado de conversión anterior
        clearConversionState();
        
        // Si hay un valor válido, convertir en tiempo real con delay
        if (this.value.trim()) {
            clearTimeout(this.convertTimeout);
            this.convertTimeout = setTimeout(() => {
                performRealtimeConversion();
            }, 300); // 300ms de delay para evitar muchas llamadas
        } else {
            // Si no hay valor, ocultar resultado
            resultDiv.style.display = 'none';
        }
    });
    
    // Event listener para guardar con Enter
    amountInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && lastConversionData) {
            saveConversion(); // Guardar en lugar de convertir
        }
    });
    
    // Event listener para limpiar resultado cuando se borra el input
    amountInput.addEventListener('input', function() {
        if (!this.value.trim()) {
            resultDiv.style.display = 'none';
            clearConversionState(); // Usar la función centralizada
        }
    });
    
    // Event listener para el checkbox de gaming (conversión en tiempo real)
    if (gamingCheckbox) {
        gamingCheckbox.addEventListener('change', function() {
            console.log('🎮 Checkbox de gaming cambió:', this.checked);
            // Reconvertir en tiempo real si hay un valor en el input
            if (amountInput.value.trim()) {
                performRealtimeConversion(); // Reconversión en tiempo real
            }
        });
    }
    
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

// Event listener para el modo noche
themeToggle.addEventListener('click', toggleTheme);

// Agregar listener para cambios en el tamaño de ventana
window.addEventListener('resize', () => {
    const newItemsPerPage = calculateItemsPerPage();
    if (newItemsPerPage !== ITEMS_PER_PAGE) {
        ITEMS_PER_PAGE = newItemsPerPage;
        
        // Ajustar la página actual si es necesario
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
        
        if (currentPage > totalPages) {
            currentPage = totalPages || 1;
        }
        
        updateHistoryDisplay();
        console.log(`📱 Pantalla redimensionada: ${ITEMS_PER_PAGE} elementos por página`);
    }
});

// === FUNCIONALIDAD DE NOTICIAS CON SWIPER.JS ===

// Variables globales para Swiper
let swiperDesktop = null;
let swiperMobile = null;
let newsLoaded = false;

/**
 * Función para detectar si es móvil
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Función para inicializar Swiper según el dispositivo
 */
function initSwiper() {
    // Verificar que Swiper esté disponible
    if (typeof Swiper === 'undefined') {
        console.error('❌ Swiper.js no está cargado');
        return;
    }
    
    console.log('🔄 Inicializando Swiper... Es móvil:', isMobile());
    
    // Destruir instancias existentes
    if (swiperDesktop) {
        swiperDesktop.destroy(true, true);
        swiperDesktop = null;
        console.log('🗑️ Swiper desktop destruido');
    }
    if (swiperMobile) {
        swiperMobile.destroy(true, true);
        swiperMobile = null;
        console.log('🗑️ Swiper mobile destruido');
    }
    
    try {
        if (isMobile()) {
            // Configuración para móvil - Effect Cards
            const mobileElement = document.querySelector('#newsMobile');
            console.log('📱 Elemento móvil encontrado:', !!mobileElement);
            
            if (mobileElement) {
                swiperMobile = new Swiper('#newsMobile', {
                    effect: 'cards',
                    grabCursor: true,
                    cardsEffect: {
                        perSlideOffset: 12,
                        perSlideRotate: 3,
                        rotate: true,
                        slideShadows: false,
                    },
                    loop: true,
                    pagination: {
                        el: '#newsMobile .swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },
                    on: {
                        init: function() {
                            console.log('📱 Swiper móvil inicializado - solo navegación manual');
                        }
                    }
                });
            }
        } else {
            // Configuración para desktop - Una noticia a la vez con scroll
            const desktopElement = document.querySelector('#newsDesktop');
            console.log('🖥️ Elemento desktop encontrado:', !!desktopElement);
            
            if (desktopElement) {
                swiperDesktop = new Swiper('#newsDesktop', {
                    direction: 'vertical',
                    slidesPerView: 1,
                    spaceBetween: 30,
                    centeredSlides: true,
                    mousewheel: {
                        enabled: true,
                        sensitivity: 1,
                        releaseOnEdges: true,
                    },
                    keyboard: {
                        enabled: true,
                        onlyInViewport: true,
                    },
                    loop: true,
                    pagination: {
                        el: '#newsDesktop .swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },
                    effect: 'slide',
                    speed: 600,
                    on: {
                        init: function() {
                            console.log('🖱️ Swiper desktop inicializado - una noticia por vez, solo scroll manual');
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('❌ Error al inicializar Swiper:', error);
    }
}

/**
 * Función para crear un slide de noticia
 */
function createNewsSlide(article) {
    const publishDate = new Date(article.pubDate);
    const now = new Date();
    const diffTime = now - publishDate;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    let timeAgo;
    if (diffHours < 1) {
        timeAgo = 'Hace menos de 1 hora';
    } else if (diffHours < 24) {
        timeAgo = `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
        timeAgo = `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    }
    
    // Limpiar y limitar la descripción
    let description = article.description || article.content || '';
    description = description.replace(/<[^>]*>/g, ''); // Remover HTML
    description = description.length > 150 ? description.substring(0, 150) + '...' : description;
    
    // Imagen de la noticia (si está disponible)
    const imageSection = article.thumbnail ? `
        <div class="news-image">
            <img src="${article.thumbnail}" alt="${article.title}" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
    ` : '';
    
    // Autor (si está disponible y no es el predeterminado)
    const author = article.author && article.author !== 'Ámbito Financiero' ? article.author : null;
    const authorSection = author ? `
        <span class="news-author">Por ${author}</span>
    ` : '';
    
    return `
        <div class="swiper-slide">
            <div class="news-slide">
                ${imageSection}
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${description}</p>
                    <div class="news-meta">
                        <div class="news-source-info">
                            <span class="news-source">Ámbito Financiero</span>
                            ${authorSection}
                        </div>
                        <span class="news-time">${timeAgo}</span>
                    </div>
                </div>
                <div class="news-actions">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-link">
                        Leer más
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 17L17 7"></path>
                            <path d="M7 7h10v10"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Función para cargar y mostrar las noticias
 */
async function loadNews() {
    if (newsLoaded) return;
    
    console.log('📰 Cargando noticias financieras...');
    console.log('📰 NewsAPI disponible:', !!window.NewsAPI);
    console.log('📰 fetchFinancialNews disponible:', !!(window.NewsAPI && window.NewsAPI.fetchFinancialNews));
    
    try {
        // Intentar cargar noticias desde la API
        const news = await window.NewsAPI.fetchFinancialNews();
        console.log('📰 Respuesta de API recibida:', !!news, 'Cantidad:', news ? news.length : 0);
        
        if (!news || news.length === 0) {
            throw new Error('No se pudieron cargar las noticias desde la API');
        }
        
        // Tomar solo las primeras 10 noticias más recientes
        const recentNews = news.slice(0, 10);
        
        // Crear slides para desktop
        const desktopWrapper = document.querySelector('#newsWrapperDesktop');
        if (desktopWrapper) {
            desktopWrapper.innerHTML = recentNews.map(article => createNewsSlide(article)).join('');
        }
        
        // Crear slides para móvil
        const mobileWrapper = document.querySelector('#newsWrapperMobile');
        if (mobileWrapper) {
            mobileWrapper.innerHTML = recentNews.map(article => createNewsSlide(article)).join('');
        }
        
        // Mostrar el contenedor de noticias
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.style.display = 'block';
            console.log('✅ Contenedor de noticias mostrado');
        } else {
            console.error('❌ No se encontró el contenedor de noticias');
        }
        
        console.log('📰 Slides creados - Desktop:', !!desktopWrapper, 'Mobile:', !!mobileWrapper);
        console.log('📰 Noticias HTML generado:', recentNews.length, 'artículos');
        
        // Mostrar/ocultar contenedores según el dispositivo
        const desktopContainer = document.querySelector('#newsDesktop');
        const mobileContainer = document.querySelector('#newsMobile');
        
        if (desktopContainer && mobileContainer) {
            if (isMobile()) {
                desktopContainer.style.display = 'none';
                mobileContainer.style.display = 'block';
                console.log('📱 Configurando vista móvil');
            } else {
                desktopContainer.style.display = 'block';
                mobileContainer.style.display = 'none';
                console.log('🖥️ Configurando vista desktop');
            }
        }
        
        // Inicializar Swiper después de cargar el contenido
        setTimeout(() => {
            initSwiper();
        }, 100);
        
        newsLoaded = true;
        console.log(`✅ ${recentNews.length} noticias cargadas desde API`);
        
    } catch (error) {
        console.warn('⚠️ Error al cargar noticias, ocultando sección de noticias:', error.message);
        
        // Ocultar completamente la sección de noticias si hay error
        hideNewsSection();
    }
}

/**
 * Función para ocultar la sección de noticias cuando hay error en la API
 */
function hideNewsSection() {
    console.log('� Ocultando sección de noticias debido a error en API');
    
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer) {
        newsContainer.style.display = 'none';
    }
    
    // También ajustar el layout para que el conversor ocupe todo el espacio
    const mainLayout = document.querySelector('.main-layout');
    const converterContainer = document.querySelector('.converter-container');
    
    if (mainLayout && converterContainer) {
        // En desktop, centrar el conversor
        if (!isMobile()) {
            mainLayout.style.justifyContent = 'center';
            converterContainer.style.maxWidth = '600px';
        }
    }
    
    newsLoaded = false; // Permitir intentar cargar de nuevo en el futuro
}

/**
 * Función para actualizar Swiper según el tamaño de pantalla
 */
function updateSwiperForScreenSize() {
    const currentIsMobile = isMobile();
    
    // Mostrar/ocultar contenedores según el dispositivo
    const desktopContainer = document.querySelector('#newsDesktop');
    const mobileContainer = document.querySelector('#newsMobile');
    
    if (desktopContainer && mobileContainer) {
        if (currentIsMobile) {
            desktopContainer.style.display = 'none';
            mobileContainer.style.display = 'block';
        } else {
            desktopContainer.style.display = 'block';
            mobileContainer.style.display = 'none';
        }
        
        // Reinicializar Swiper para el nuevo tamaño
        initSwiper();
    }
}

// Event listener para cambios de tamaño de pantalla (incluyendo Swiper)
window.addEventListener('resize', () => {
    const newItemsPerPage = calculateItemsPerPage();
    if (newItemsPerPage !== ITEMS_PER_PAGE) {
        ITEMS_PER_PAGE = newItemsPerPage;
        
        // Ajustar la página actual si es necesario
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
        
        if (currentPage > totalPages) {
            currentPage = totalPages || 1;
        }
        
        updateHistoryDisplay();
        console.log(`📱 Pantalla redimensionada: ${ITEMS_PER_PAGE} elementos por página`);
    }
    
    // Actualizar Swiper para el nuevo tamaño de pantalla
    if (newsLoaded) {
        updateSwiperForScreenSize();
    }
});

// Inicializar noticias cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que todas las dependencias estén cargadas
    const checkDependencies = () => {
        if (typeof Swiper !== 'undefined') {
            console.log('✅ Swiper.js cargado correctamente');
            
            // Verificar si NewsAPI está disponible
            if (window.NewsAPI && typeof window.NewsAPI.fetchFinancialNews === 'function') {
                console.log('✅ NewsAPI disponible, intentando cargar noticias...');
                loadNews();
            } else {
                console.warn('⚠️ NewsAPI no disponible, ocultando sección de noticias...');
                hideNewsSection();
            }
        } else {
            console.warn('⚠️ Esperando que se cargue Swiper.js...');
            setTimeout(checkDependencies, 500);
        }
    };
    
    // Empezar a verificar después de un pequeño delay
    setTimeout(checkDependencies, 1000);
});
