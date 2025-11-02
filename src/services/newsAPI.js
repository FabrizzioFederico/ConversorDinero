// News API Configuration
const NEWS_API_BASE_URL = 'https://api.rss2json.com/v1/api.json';
const AMBITO_RSS_URL = 'https://www.ambito.com/rss/economia.xml';
const NEWS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Cache de noticias
let newsCache = {
    data: [],
    lastFetch: null
};

/**
 * Función para obtener noticias financieras desde Ámbito Financiero
 */
export async function fetchFinancialNews() {
    try {
        const now = Date.now();
        
        // Verificar si hay cache válido
        if (newsCache.data.length > 0 && newsCache.lastFetch) {
            const timeSinceLastFetch = now - newsCache.lastFetch;
            if (timeSinceLastFetch < NEWS_CACHE_DURATION) {
                console.log('📰 Devolviendo noticias desde cache');
                return newsCache.data;
            }
        }
        
        console.log('📰 Obteniendo noticias financieras de Ámbito...');
        
        // Usar la API sin API key
        const response = await fetch(`${NEWS_API_BASE_URL}?rss_url=${encodeURIComponent(AMBITO_RSS_URL)}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`Error en RSS2JSON: ${data.message || 'Error desconocido'}`);
        }
        
        // Procesar y limpiar los datos de noticias
        const processedNews = data.items.map(item => {
            // Limpiar HTML del description
            const cleanDescription = (item.description || '')
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .trim();

            // Extraer imagen thumbnail
            let thumbnail = item.thumbnail || item.enclosure?.link || null;
            
            if (!thumbnail && item.content) {
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                    thumbnail = imgMatch[1];
                }
            }

            return {
                title: item.title?.trim() || 'Sin título',
                link: item.link || '#',
                description: cleanDescription || 'Sin descripción disponible',
                thumbnail: thumbnail,
                pubDate: item.pubDate || new Date().toISOString(),
                author: item.author || 'Ámbito Financiero',
                guid: item.guid || item.link,
                categories: item.categories || []
            };
        });

        // Actualizar cache
        newsCache.data = processedNews;
        newsCache.lastFetch = now;
        
        console.log(`📰 ${processedNews.length} noticias obtenidas exitosamente`);
        return processedNews;
        
    } catch (error) {
        console.error('❌ Error al obtener noticias:', error);
        
        // En caso de error, devolver cache si existe
        if (newsCache.data.length > 0) {
            console.log('📰 Devolviendo noticias desde cache debido a error');
            return newsCache.data;
        }
        
        throw error;
    }
}

/**
 * Función para formatear fecha de publicación
 */
export function formatNewsDate(pubDate) {
    try {
        const date = new Date(pubDate);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Hace unos minutos';
        } else if (diffInHours < 24) {
            return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) {
                return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
            } else {
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    } catch (error) {
        return 'Fecha no disponible';
    }
}

export default {
    fetchFinancialNews,
    formatNewsDate
};
