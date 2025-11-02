import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, EffectCards } from 'swiper/modules';
import { fetchFinancialNews, formatNewsDate } from '../services/newsAPI';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchFinancialNews();
        const recentNews = data.slice(0, 10);
        setNews(recentNews);
        setError(null);
      } catch (err) {
        console.error('Error al cargar noticias:', err);
        setError('No se pudieron cargar las noticias');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (error) {
    return null; // No mostrar nada si hay error
  }

  if (loading) {
    return (
      <div className="news-container loading-news">
        <h2 className="news-title">Noticias Financieras</h2>
        <div className="news-loading">
          <div className="spinner"></div>
          <p>Cargando noticias...</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  const NewsCard = ({ article }) => {
    const timeAgo = formatNewsDate(article.pubDate);
    const description = article.description.length > 150 
      ? article.description.substring(0, 150) + '...' 
      : article.description;

    return (
      <div className="news-slide">
        {article.thumbnail && (
          <div className="news-image-container">
            <img 
              src={article.thumbnail} 
              alt={article.title}
              className="news-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="news-content">
          <h3 className="news-article-title">{article.title}</h3>
          <p className="news-description">{description}</p>
          <div className="news-meta">
            <div className="news-source-info">
              <span className="news-source">Ámbito Financiero</span>
              {article.author && article.author !== 'Ámbito Financiero' && (
                <span className="news-author"> • {article.author}</span>
              )}
            </div>
            <span className="news-time">{timeAgo}</span>
          </div>
        </div>
        <div className="news-actions">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="news-link"
          >
            Leer más
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="news-container">
      <h2 className="news-title">Noticias Financieras</h2>
      
      {isMobile ? (
        // Mobile: Cards effect
        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards, Pagination]}
          pagination={{ clickable: true }}
          className="news-swiper-mobile"
        >
          {news.map((article, index) => (
            <SwiperSlide key={article.guid || index}>
              <NewsCard article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Desktop: Mousewheel effect
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={20}
          mousewheel={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Mousewheel]}
          className="news-swiper-desktop"
        >
          {news.map((article, index) => (
            <SwiperSlide key={article.guid || index}>
              <NewsCard article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default News;
