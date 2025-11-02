function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>💱 Acerca de F&M Rates</h1>
        
        <section className="about-section">
          <h2>¿Qué es F&M Rates?</h2>
          <p>
            F&M Rates es una aplicación web moderna para conversión de monedas en tiempo real
            con cálculo de impuestos argentinos, diseño glassmorphism y funcionalidades avanzadas.
          </p>
        </section>

        <section className="about-section">
          <h2>🌟 Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Conversión de Monedas</h3>
              <ul>
                <li>Conversión en tiempo real</li>
                <li>Más de 40 monedas disponibles</li>
                <li>Intercambio rápido de divisas</li>
                <li>Validación inteligente</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🇦🇷</div>
              <h3>Impuestos Argentinos</h3>
              <ul>
                <li>Cálculo automático de IVA (21%)</li>
                <li>Impuesto a las Ganancias (30%)</li>
                <li>Exención para compras gaming</li>
                <li>Desglose detallado</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Diseño y UX</h3>
              <ul>
                <li>Diseño glassmorphism moderno</li>
                <li>100% responsive</li>
                <li>Modo oscuro/claro</li>
                <li>Animaciones fluidas</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Historial y Gestión</h3>
              <ul>
                <li>Guarda todas las conversiones</li>
                <li>Paginación inteligente</li>
                <li>Exportación a JSON</li>
                <li>Persistencia local</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🛠️ Tecnologías Utilizadas</h2>
          <div className="tech-list">
            <div className="tech-item">
              <strong>React 18</strong>
              <p>Framework principal para la interfaz de usuario</p>
            </div>
            <div className="tech-item">
              <strong>React Router</strong>
              <p>Navegación entre páginas</p>
            </div>
            <div className="tech-item">
              <strong>Vite</strong>
              <p>Build tool ultra rápido</p>
            </div>
            <div className="tech-item">
              <strong>Exchange Rate API</strong>
              <p>API de tasas de cambio en tiempo real</p>
            </div>
            <div className="tech-item">
              <strong>CSS3 Moderno</strong>
              <p>Flexbox, Grid, Variables CSS, Animaciones</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>📊 API de Tipos de Cambio</h2>
          <p>
            Utilizamos <strong>Exchange Rate API</strong> para obtener las tasas de cambio
            más actualizadas del mercado. Los datos se actualizan diariamente y provienen
            de fuentes confiables del mercado financiero internacional.
          </p>
        </section>

        <section className="about-section">
          <h2>🎯 Versión</h2>
          <p className="version-info">
            <strong>Versión:</strong> 2.0.0 (React Migration)
            <br />
            <strong>Última actualización:</strong> Noviembre 2025
          </p>
        </section>

        <section className="about-section">
          <h2>📝 Nota Importante</h2>
          <div className="disclaimer">
            <p>
              ⚠️ Los tipos de cambio mostrados son referenciales y pueden diferir levemente
              de los valores finales aplicados por instituciones financieras. Esta aplicación
              es una herramienta de referencia y no constituye asesoramiento financiero.
            </p>
          </div>
        </section>

        <section className="about-section credits">
          <h2>👨‍💻 Desarrolladores</h2>
          <p>
            Desarrollado con ❤️ por <strong>F&M Team</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
