import { useState } from 'react';
import { getFlagUrl } from '../services/currencyAPI';

function History({ conversions, onDelete, onExport }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Historial de Conversiones</h2>
        {conversions.length > 0 && (
          <button className="export-btn" onClick={onExport}>
            📥 Exportar JSON
          </button>
        )}
      </div>

      {conversions.length === 0 ? (
        <div className="empty-history">
          <p>No hay conversiones guardadas</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {currentItems.map((conversion) => (
              <div key={conversion.id} className="history-item">
                <div className="history-item-header">
                  <span className="history-date">{formatDate(conversion.date)}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => onDelete(conversion.id)}
                    aria-label="Eliminar"
                  >
                    🗑️
                  </button>
                </div>

                <div className="history-item-content">
                  <div className="currency-info">
                    <img 
                      src={getFlagUrl(conversion.fromCurrency)} 
                      alt={conversion.fromCurrency}
                      className="flag-icon"
                    />
                    <span className="currency-amount">
                      {formatCurrency(conversion.amount, conversion.fromCurrency)}
                    </span>
                  </div>

                  <span className="arrow">→</span>

                  <div className="currency-info">
                    <img 
                      src={getFlagUrl(conversion.toCurrency)} 
                      alt={conversion.toCurrency}
                      className="flag-icon"
                    />
                    <span className="currency-amount">
                      {formatCurrency(conversion.result, conversion.toCurrency)}
                    </span>
                  </div>
                </div>

                {conversion.taxBreakdown && (
                  <div className="history-tax-info">
                    <small>🇦🇷 Con impuestos argentinos</small>
                    {conversion.isGamingPurchase && (
                      <small className="gaming-tag">🎮 Gaming</small>
                    )}
                  </div>
                )}

                <div className="exchange-rate-info">
                  <small>
                    Tasa: 1 {conversion.fromCurrency} = {conversion.exchangeRate?.toFixed(4)} {conversion.toCurrency}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default History;
