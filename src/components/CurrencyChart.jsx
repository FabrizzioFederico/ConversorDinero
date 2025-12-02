import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CurrencyChart() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  const popularCurrencies = ['EUR', 'GBP', 'JPY', 'ARS', 'BRL', 'MXN'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener las tasas de cambio');
        }
        
        const data = await response.json();
        setRates(data.rates);
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    
    // Actualizar cada 60 segundos
    const interval = setInterval(fetchRates, 60000);
    
    return () => clearInterval(interval);
  }, [baseCurrency]);

  const chartData = {
    labels: popularCurrencies,
    datasets: [
      {
        label: `Tasa de cambio (base: ${baseCurrency})`,
        data: rates ? popularCurrencies.map(currency => rates[currency] || 0) : [],
        borderColor: 'rgba(52, 152, 219, 1)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
      }
    ]
  };

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: isDark ? '#ecf0f1' : '#2c3e50',
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `1 ${baseCurrency} = ${context.parsed.y.toFixed(4)} ${context.label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#bdc3c7' : '#7f8c8d',
          font: {
            size: 11
          },
          callback: function(value) {
            return value.toFixed(2);
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#bdc3c7' : '#7f8c8d',
          font: {
            size: 11,
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>📈 Tasas de Cambio en Tiempo Real</h3>
        <select 
          value={baseCurrency} 
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="chart-currency-select"
        >
          <option value="USD">USD - Dólar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - Libra</option>
          <option value="ARS">ARS - Peso Argentino</option>
        </select>
      </div>
      
      {loading && (
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      )}
      
      {error && (
        <div className="chart-error">
          <p>❌ Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}
      
      {!loading && !error && rates && (
        <div className="chart-wrapper">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

export default CurrencyChart;
