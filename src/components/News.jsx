import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import { fetchFinancialNews, formatNewsDate } from '../services/newsAPI';
import 'swiper/css';
import 'swiper/css/pagination';

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
    const description = article.description.length > 70 
      ? article.description.substring(0, 70) + '...' 
      : article.description;

    // Función para manejar error de imagen
    const handleImageError = (e) => {
      e.target.onerror = null; // Prevenir loop infinito
      e.target.src = 'https://via.placeholder.com/400x200/1e3a8a/ffffff?text=El+Economista';
    };

    return (
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="news-slide news-slide-link"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="news-image-container">
          <img 
            src={article.thumbnail || 'https://via.placeholder.com/400x200/1e3a8a/ffffff?text=El+Economista'} 
            alt={article.title}
            className="news-image"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        <div className="news-content">
          <h3 className="news-article-title">{article.title}</h3>
          <p className="news-description">{description}</p>
          <div className="news-meta">
            <div className="news-source-info">
              <span className="news-source">El Economista</span>
              {article.author && article.author !== 'El Economista' && (
                <span className="news-author"> • {article.author}</span>
              )}
            </div>
            <span className="news-time">{timeAgo}</span>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="news-container">
      <h2 className="news-title">Noticias Financieras</h2>
      
      <Swiper
        key={isMobile ? "mobile-swiper" : "desktop-swiper"}
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={true}
        centerInsufficientSlides={true}
        loop={true}
        loopedSlides={news.length}
        mousewheel={{
          sensitivity: 1,
          releaseOnEdges: false,
        }}
        pagination={{ 
          clickable: true,
          type: 'bullets',
          renderBullet: (index, className) => {
            return `<span class="${className}"></span>`;
          }
        }}
        modules={[Pagination, Mousewheel]}
        className={isMobile ? "news-swiper-mobile" : "news-swiper-desktop"}
      >
        {news.map((article, index) => (
          <SwiperSlide key={article.guid || index}>
            <NewsCard article={article} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default News;
