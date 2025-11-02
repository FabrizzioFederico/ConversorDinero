import { useState, useEffect, useCallback } from 'react';
import { convertCurrency, getFlagUrl, currencies } from '../services/currencyAPI';

function Converter({ onConversionSave }) {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showArgentineTax, setShowArgentineTax] = useState(false);
  const [isGamingPurchase, setIsGamingPurchase] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    // Verificar si se debe mostrar el cálculo de impuestos argentinos
    const shouldShowTax = 
      (fromCurrency === 'USD' || fromCurrency === 'EUR') && 
      toCurrency === 'ARS';
    setShowArgentineTax(shouldShowTax);
  }, [fromCurrency, toCurrency]);

  const handleConvert = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setResult(null);
      setExchangeRate(null);
      setIsLoading(false);
      return;
    }

    // Si solo cambió el gaming checkbox y ya hay resultado, recalcular directamente
    if (result && !isLoading) {
      try {
        const data = await convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
        
        let finalAmount = data.convertedAmount;
        let taxBreakdown = null;

        if (showArgentineTax) {
          const baseAmount = data.convertedAmount;
          const iva = baseAmount * 0.21;
          const ganancias = isGamingPurchase ? 0 : baseAmount * 0.30;
          finalAmount = baseAmount + iva + ganancias;

          taxBreakdown = {
            base: baseAmount,
            iva: iva,
            ganancias: ganancias,
            total: finalAmount
          };
        }

        setResult({
          amount: finalAmount,
          taxBreakdown: taxBreakdown
        });
        setExchangeRate(data.exchangeRate);
      } catch (error) {
        console.error('Error al convertir:', error);
      }
      return;
    }

    // Conversión normal con loading state
    setIsLoading(true);
    try {
      const data = await convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
      
      let finalAmount = data.convertedAmount;
      let taxBreakdown = null;

      if (showArgentineTax) {
        const baseAmount = data.convertedAmount;
        const iva = baseAmount * 0.21;
        const ganancias = isGamingPurchase ? 0 : baseAmount * 0.30;
        finalAmount = baseAmount + iva + ganancias;

        taxBreakdown = {
          base: baseAmount,
          iva: iva,
          ganancias: ganancias,
          total: finalAmount
        };
      }

      setResult({
        amount: finalAmount,
        taxBreakdown: taxBreakdown
      });
      setExchangeRate(data.exchangeRate);
    } catch (error) {
      console.error('Error al convertir:', error);
      alert('Error al realizar la conversión. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, isGamingPurchase, showArgentineTax, result, isLoading]);

  useEffect(() => {
    // Si ya hay resultado y solo cambió el checkbox, recalcular inmediatamente
    if (result && amount && parseFloat(amount) > 0 && !isLoading) {
      handleConvert();
      return;
    }
    
    // Para cambios en el input, usar debounce
    const timer = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        handleConvert();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, isGamingPurchase, showArgentineTax]);

  const handleSwap = () => {
    setIsSwapping(true);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setTimeout(() => {
      setIsSwapping(false);
    }, 600);
  };

  const handleSave = () => {
    if (!result || !amount) {
      return;
    }

    const conversion = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      fromCurrency,
      toCurrency,
      result: result.amount,
      exchangeRate,
      taxBreakdown: result.taxBreakdown,
      isGamingPurchase: showArgentineTax ? isGamingPurchase : null
    };

    onConversionSave(conversion);
    
    // Mostrar feedback visual
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="converter-container">
      <h1>F&M Rates</h1>
      <p className="subtitle">
        Tener en cuenta: los tipos de cambio se actualizan diariamente y pueden diferir levemente.
      </p>

      <div className="converter-box">
        {exchangeRate && (
          <div className="exchange-rate-display">
            <span className="exchange-rate-label">Tipo de cambio medio del mercado</span>
            <span className="exchange-rate-value">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </span>
          </div>
        )}

        <input
          type="number"
          className="input-amount"
          placeholder="Ingrese cantidad"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />

        <div className="currency-selectors">
          <div className="currency-select-wrapper">
            <img 
              src={getFlagUrl(fromCurrency)} 
              alt={fromCurrency}
              className="flag-icon"
            />
            <select
              className="currency-select"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          <button className={`swap-btn ${isSwapping ? 'rotating' : ''}`} onClick={handleSwap}>
            ⇄
          </button>

          <div className="currency-select-wrapper reverse">
            <select
              className="currency-select"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
            <img 
              src={getFlagUrl(toCurrency)} 
              alt={toCurrency}
              className="flag-icon"
            />
          </div>
        </div>

        {showArgentineTax && (
          <div className="argentine-tax-container">
            <div className="tax-info">
              <span className="tax-label">🇦🇷 Conversión con impuestos argentinos</span>
              <small className="tax-description">
                Se aplicarán IVA (21%) e Impuesto a las Ganancias (30%)
              </small>
            </div>
            <div className="gaming-checkbox-container">
              <label className="gaming-checkbox-label">
                <input
                  type="checkbox"
                  className="gaming-checkbox"
                  checked={isGamingPurchase}
                  onChange={(e) => setIsGamingPurchase(e.target.checked)}
                />
                <span className="checkbox-text">🎮 Compra gaming (sin imp. ganancias)</span>
              </label>
            </div>
          </div>
        )}

        {result && (
          <div className="result show">
            <div className="result-content">
              {result.taxBreakdown ? (
                <div className="tax-breakdown">
                  <div className="tax-item">
                    <span>Monto base:</span>
                    <span>{formatCurrency(result.taxBreakdown.base, toCurrency)}</span>
                  </div>
                  <div className="tax-item">
                    <span>IVA (21%):</span>
                    <span>{formatCurrency(result.taxBreakdown.iva, toCurrency)}</span>
                  </div>
                  {result.taxBreakdown.ganancias > 0 && (
                    <div className="tax-item">
                      <span>Imp. Ganancias (30%):</span>
                      <span>{formatCurrency(result.taxBreakdown.ganancias, toCurrency)}</span>
                    </div>
                  )}
                  <div className="tax-item total">
                    <span>Total:</span>
                    <span>{formatCurrency(result.taxBreakdown.total, toCurrency)}</span>
                  </div>
                </div>
              ) : (
                <span className="converted-amount">
                  {formatCurrency(result.amount, toCurrency)}
                </span>
              )}
            </div>
          </div>
        )}

        <button 
          className={`convert-btn ${isSaved ? 'saved' : ''}`} 
          onClick={handleSave} 
          disabled={isLoading || !result || isSaved}
        >
          {isLoading ? 'Convirtiendo...' : isSaved ? '✓ Guardado' : 'Guardar conversión'}
        </button>
      </div>
    </div>
  );
}

export default Converter;
