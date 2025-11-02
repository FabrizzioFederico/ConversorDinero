import Converter from '../components/Converter';
import News from '../components/News';

function Home({ onConversionSave }) {
  return (
    <div className="home-page">
      {/* Contenido principal */}
      <div className="main-layout">
        <Converter onConversionSave={onConversionSave} />
        <News />
      </div>
    </div>
  );
}

export default Home;
