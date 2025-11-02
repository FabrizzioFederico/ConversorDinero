import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFlagUrl, currencies, convertCurrency } from '../services/currencyAPI';

function Sidebar({ conversions, onDelete, onEdit, onExport, isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingConversion, setEditingConversion] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    fromCurrency: '',
    toCurrency: '',
    isGamingPurchase: false
  });
  const [previewResult, setPreviewResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [showArgentineTax, setShowArgentineTax] = useState(false);
  const [isEditSwapping, setIsEditSwapping] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    // Prevenir scroll del body cuando el sidebar está abierto
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = conversions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(conversions.length / itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const handleEditClick = (conversion) => {
    setEditingConversion(conversion);
    setEditForm({
      amount: conversion.amount,
      fromCurrency: conversion.fromCurrency,
      toCurrency: conversion.toCurrency,
      isGamingPurchase: conversion.isGamingPurchase || false
    });
    setPreviewResult(null);
  };

  // Detectar si debe mostrar el checkbox de impuestos argentinos
  useEffect(() => {
    const shouldShowTax = 
      (editForm.fromCurrency === 'USD' || editForm.fromCurrency === 'EUR') && 
      editForm.toCurrency === 'ARS';
    setShowArgentineTax(shouldShowTax);
  }, [editForm.fromCurrency, editForm.toCurrency]);

  // Conversión en tiempo real mientras editas
  useEffect(() => {
    const performConversion = async () => {
      if (editForm.amount && parseFloat(editForm.amount) > 0 && editForm.fromCurrency && editForm.toCurrency) {
        setIsConverting(true);
        try {
          const data = await convertCurrency(
            parseFloat(editForm.amount),
            editForm.fromCurrency,
            editForm.toCurrency
          );
          
          let finalAmount = data.convertedAmount;
          
          // Aplicar impuestos argentinos si corresponde
          if (showArgentineTax) {
            const baseAmount = data.convertedAmount;
            const iva = baseAmount * 0.21;
            const ganancias = editForm.isGamingPurchase ? 0 : baseAmount * 0.30;
            finalAmount = baseAmount + iva + ganancias;
          }
          
          setPreviewResult(finalAmount);
        } catch (error) {
          console.error('Error al convertir:', error);
          setPreviewResult(null);
        } finally {
          setIsConverting(false);
        }
      } else {
        setPreviewResult(null);
      }
    };

    const timer = setTimeout(() => {
      performConversion();
    }, 300);

    return () => clearTimeout(timer);
  }, [editForm.amount, editForm.fromCurrency, editForm.toCurrency, editForm.isGamingPurchase, showArgentineTax]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingConversion && editForm.amount > 0) {
      onEdit(editingConversion.id, {
        amount: parseFloat(editForm.amount),
        fromCurrency: editForm.fromCurrency,
        toCurrency: editForm.toCurrency,
        date: new Date().toISOString() // Actualizar fecha
      });
      setEditingConversion(null);
      setPreviewResult(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingConversion(null);
    setEditForm({ amount: '', fromCurrency: '', toCurrency: '', isGamingPurchase: false });
    setPreviewResult(null);
    setShowArgentineTax(false);
  };

  const handleEditSwap = () => {
    setIsEditSwapping(true);
    setEditForm({
      ...editForm,
      fromCurrency: editForm.toCurrency,
      toCurrency: editForm.fromCurrency
    });
    setTimeout(() => {
      setIsEditSwapping(false);
    }, 600);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <h2>Menú</h2>
        </div>

        {/* Navegación de páginas */}
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-nav-link" onClick={onClose}>
            🏠 Inicio
          </Link>
          <Link to="/about" className="sidebar-nav-link" onClick={onClose}>
            ℹ️ Acerca de
          </Link>
          <Link to="/contact" className="sidebar-nav-link" onClick={onClose}>
            📧 Contacto
          </Link>
        </nav>

        <div className="sidebar-divider"></div>

        {/* Historial de conversiones */}
        <div className="sidebar-section">
          <div className="section-header">
            <h3>Historial</h3>
            {conversions.length > 0 && (
              <button className="export-btn-small" onClick={onExport} title="Exportar JSON">
                📥
              </button>
            )}
          </div>

          <div className="history-list" id="historyList">
            {conversions.length === 0 ? (
              <div className="empty-history">
                <p>No hay conversiones</p>
              </div>
            ) : (
              currentItems.map((conversion) => (
                <div key={conversion.id} className="history-item">
                  <div className="history-item-header">
                    <span className="history-date">{formatDate(conversion.date)}</span>
                    <div className="history-actions">
                      <button 
                        className="edit-btn-small"
                        onClick={() => handleEditClick(conversion)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn-small"
                        onClick={() => onDelete(conversion.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="conversion-row">
                    <div className="currency-block">
                      <img 
                        src={getFlagUrl(conversion.fromCurrency)} 
                        alt={conversion.fromCurrency}
                        className="flag-small"
                      />
                      <div className="currency-details">
                        <span className="currency-code">{conversion.fromCurrency}</span>
                        <span className="currency-amount-small">
                          {formatCurrency(conversion.amount, conversion.fromCurrency)}
                        </span>
                      </div>
                    </div>

                    <div className="arrow-icon">→</div>

                    <div className="currency-block">
                      <img 
                        src={getFlagUrl(conversion.toCurrency)} 
                        alt={conversion.toCurrency}
                        className="flag-small"
                      />
                      <div className="currency-details">
                        <span className="currency-code">{conversion.toCurrency}</span>
                        <span className="currency-amount-small">
                          {formatCurrency(conversion.result, conversion.toCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {conversion.taxBreakdown && (
                    <div className="tax-badge">
                      <small>🇦🇷 Con impuestos</small>
                      {conversion.isGamingPurchase && (
                        <small className="gaming-badge">🎮</small>
                      )}
                    </div>
                  )}

                  <div className="exchange-rate-small">
                    <small>
                      1 {conversion.fromCurrency} = {conversion.exchangeRate?.toFixed(4)} {conversion.toCurrency}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                id="prevPage"
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <span id="pageInfo" className="page-info">
                Página {currentPage}
              </span>
              <button
                id="nextPage"
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <div 
        className={`overlay ${isOpen ? 'active' : ''}`} 
        id="overlay"
        onClick={onClose}
      ></div>

      {/* Modal de edición */}
      {editingConversion && (
        <>
          <div className="edit-modal-overlay" onClick={handleCancelEdit}></div>
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>✏️ Editar Conversión</h3>
              <button className="close-modal-btn" onClick={handleCancelEdit}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-modal-form">
              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                  className="edit-input"
                />
              </div>

              <div className="edit-currency-selectors">
                <div className="form-group">
                  <label>De</label>
                  <div className="select-with-flag">
                    <img 
                      src={getFlagUrl(editForm.fromCurrency)} 
                      alt={editForm.fromCurrency}
                      className="flag-small"
                    />
                    <select
                      value={editForm.fromCurrency}
                      onChange={(e) => setEditForm({ ...editForm, fromCurrency: e.target.value })}
                      required
                      className="edit-select"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="button"
                  className={`swap-btn ${isEditSwapping ? 'rotating' : ''}`} 
                  onClick={handleEditSwap}
                  title="Intercambiar monedas"
                >
                  ⇄
                </button>

                <div className="form-group">
                  <label>A</label>
                  <div className="select-with-flag">
                    <img 
                      src={getFlagUrl(editForm.toCurrency)} 
                      alt={editForm.toCurrency}
                      className="flag-small"
                    />
                    <select
                      value={editForm.toCurrency}
                      onChange={(e) => setEditForm({ ...editForm, toCurrency: e.target.value })}
                      required
                      className="edit-select"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Checkbox de compra gaming para conversiones a ARS */}
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
                        checked={editForm.isGamingPurchase}
                        onChange={(e) => setEditForm({ ...editForm, isGamingPurchase: e.target.checked })}
                      />
                      <span className="checkbox-text">🎮 Compra gaming (sin imp. ganancias)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Preview del resultado en tiempo real */}
              {previewResult !== null && (
                <div className="edit-preview-result">
                  <div className="preview-label">Resultado:</div>
                  <div className="preview-amount">
                    {isConverting ? (
                      <span className="converting-text">Convirtiendo...</span>
                    ) : (
                      <span>
                        {new Intl.NumberFormat('es-AR', {
                          style: 'currency',
                          currency: editForm.toCurrency,
                          currencyDisplay: 'code',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(previewResult)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="edit-modal-actions">
                <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
                  Cancelar
                </button>
                <button type="submit" className="save-edit-btn">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
