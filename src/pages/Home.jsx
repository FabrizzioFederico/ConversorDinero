import Converter from '../components/Converter';
import News from '../components/News';
import CurrencyChart from '../components/CurrencyChart';

function Home({ onConversionSave }) {
  return (
    <div className="home-page">
      {/* Contenido principal */}
      <div className="main-layout">
        <div className="converter-container">
          <Converter onConversionSave={onConversionSave} />
          <CurrencyChart />
        </div>
        <News />
      </div>
    </div>
  );
}

export default Home;
