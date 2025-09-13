# 💱 F&M Rates (Conversor de Dinero)

Una aplicación web moderna para conversión de monedas en tiempo real con cálculo de impuestos argentinos, diseño glassmorphism y funcionalidades avanzadas.

## 🌟 Características Principales

### 💰 Conversión de Monedas
- **Conversión en tiempo real**: Los resultados se actualizan automáticamente mientras escribes
- **Más de 170 monedas**: Soporte completo para monedas de todo el mundo
- **Intercambio rápido**: Botón para intercambiar monedas de origen y destino
- **Validación inteligente**: Solo permite entrada de números válidos

### 🇦🇷 Sistema de Impuestos Argentinos
- **Cálculo automático de impuestos**: Para conversiones USD/EUR → ARS
- **IVA del 21%**: Aplicado siempre en conversiones argentinas
- **Impuesto a las Ganancias del 30%**: Con opción de exención para gaming
- **Desglose detallado**: Muestra monto base, IVA, Ganancias y total final
- **Checkbox de Gaming**: Permite eximir el impuesto a las ganancias

### 📱 Diseño y UX
- **Glassmorphism Design**: Efectos de vidrio esmerilado modernos
- **Responsive**: Perfectamente adaptado para móvil y desktop
- **Modo Oscuro/Claro**: Cambio suave entre temas
- **Animaciones fluidas**: Transiciones CSS optimizadas
- **Favicon personalizado**: Icono de dinero en la pestaña

### 📰 Sistema de Noticias
- **Noticias financieras**: Integración con API de noticias
- **Carrusel Swiper**: Navegación touch-friendly en móvil
- **Diseño adaptivo**: Diferentes layouts para móvil y desktop
- **Paginación**: Sistema de páginas para navegación

### 💾 Historial y Gestión
- **Historial completo**: Guarda todas las conversiones realizadas
- **Paginación**: 5 conversiones por página
- **Edición**: Permite modificar conversiones guardadas
- **Eliminación**: Borrar conversiones del historial
- **Persistencia**: Datos guardados en localStorage

### 🎨 Interfaz Avanzada
- **Banderas de países**: Visualización de banderas por moneda
- **Tipo de cambio en tiempo real**: Muestra la tasa actual
- **Menú hamburguesa**: Navegación optimizada para móvil
- **Sin scroll en menú**: Previene scroll accidental en móvil
- **Sidebar responsiva**: Panel lateral con historial

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Flexbox, Grid, Variables CSS, Animaciones
- **JavaScript ES6+**: Async/await, Módulos, Event Listeners
- **Swiper.js**: Carrusel de noticias responsivo
- **ExchangeRate API**: Conversión de monedas en tiempo real
- **NewsAPI**: Noticias financieras actualizadas
- **LocalStorage**: Persistencia de datos local

## 📂 Estructura del Proyecto

```
ConversorDinero/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos completos con glassmorphism
├── js/
│   ├── app.js             # Lógica principal de la aplicación
│   └── currencyapi.js     # API de monedas y países
└── README.md              # Documentación del proyecto
```

## 🚀 Funcionalidades Implementadas por Prompts

### 1. **Conversión en Tiempo Real**
> *"Me gustaría que el botón que dice convertir, diga guardar conversión. Porque mi idea ahora es que se convierta en tiempo real"*

- Cambio del botón de "Convertir" a "Guardar conversión"
- Implementación de conversión automática mientras se escribe
- Sistema de debounce (300ms) para optimizar performance
- Separación entre conversión en tiempo real y guardado en historial

### 2. **Animaciones Suaves**
> *"Esta perfecto, solo que me gustaría que no aparezca de golpe sino que tenga como un efecto de desplazamiento"*

- Implementación de animaciones CSS slide-in/slide-out
- Efectos de opacidad y transform con cubic-bezier
- Animaciones fluidas para mostrar/ocultar resultados
- Transiciones optimizadas para todos los elementos

### 3. **Formato Limpio de Impuestos**
> *"Solo que no quiero que me muestre en USD a ARS y de EUR a ARS (5,00 USD = 8636,86 ARS esto no lo muestres)"*

- Eliminación de la línea de conversión base
- Formato limpio solo con desglose de impuestos
- Estructura clara: Monto base + IVA + Ganancias = Total
- Información organizada y fácil de leer

### 4. **Mejoras de UI/UX**
> *"Quiero que el resultado esté centrado y tenga el mismo color que el <span> con la clase='exchange-rate-value'"*

- Centrado perfecto de resultados
- Consistencia de colores con exchange-rate-value
- Diseño glassmorphism completo
- Efectos de backdrop-blur y transparencias

### 5. **Alineación de Layout**
> *"Me gustaría que los hijos el news-container y el converter-container siempre queden alineados por más que el converter-container se vaya agrandando"*

- Sistema flexbox optimizado para main-layout
- Alineación consistente independiente del contenido
- Responsive design para todos los tamaños de pantalla

### 6. **Espaciado Móvil**
> *"Me gustaría que main-layout en mobile tenga un poco de separación con el footer"*

- Espaciado específico para móvil
- Separación visual mejorada
- Padding optimizado para diferentes dispositivos

### 7. **Paginación Estandarizada**
> *"Me gustaría que en historial tanto en mobile como en desktop se vean 5 conversiones guardadas por paginador"*

- Fijación de 5 elementos por página en todos los dispositivos
- Paginación consistente mobile/desktop
- Navegación mejorada del historial

### 8. **Modo Oscuro Mejorado**
> *"[data-theme="dark"] .currency-select option me podrías cambiar el background para que sea más legible"*

- Mejora de legibilidad en modo oscuro
- Background optimizado para select options
- Contraste mejorado para accesibilidad

### 9. **Favicon Personalizado**
> *"Agrégale un icono en el head de un signito de dinero para que vea en la pestaña"*

- Favicon con emoji de dinero (💰)
- Implementación SVG data URI
- Icono visible en todas las pestañas

### 10. **Transiciones Optimizadas**
> *"Lo que noto es que de modo claro a obscuro lo siento fluido al cambio con buena ui, pero al pasar de oscuro a claro lo noto como con un delay como que no es suave"*

- Optimización con requestAnimationFrame
- Transiciones fluidas bidireccionales
- Sincronización perfecta de cambios de tema

### 11. **Paginación Siempre Visible**
> *"Me gustaría que el paginador, por más que no hayan 5 páginas o estén las 5 páginas se muestre siempre en la parte inferior de la pantalla"*

- Paginación sticky siempre visible
- Posicionamiento fijo en la parte inferior
- Visibilidad independiente del contenido

### 12. **Transiciones Móvil Suaves**
> *"Lo único que noté es que en la versión mobile no es tan fluida el cambio de obscuro a claro en las Cards Effect"*

- Optimización específica para móvil
- Transiciones Swiper mejoradas
- Animaciones Cards Effect más fluidas

### 13. **Limpieza Visual**
> *"Me podrías quitar el box-shadow"*

- Eliminación de sombras de elementos específicos
- Diseño más limpio y minimalista
- Mantenimiento de efectos glassmorphism principales

### 14. **Prevención de Scroll en Menú**
> *"Me gustaría que cuando el menú de hamburguesa en mobile cuando esté abierto no me deje scrollear para abajo"*

- Clase CSS `.no-scroll` para prevenir scroll
- JavaScript para controlar el estado del body
- Mejor UX en navegación móvil

## 🎨 Paleta de Colores

### Modo Claro
- **Primario**: #2c3e50 (Azul oscuro)
- **Secundario**: #3498db (Azul)
- **Acento**: #e74c3c (Rojo)
- **Fondo**: Gradiente glassmorphism con tonos azules
- **Texto**: #2c3e50

### Modo Oscuro
- **Primario**: #ecf0f1 (Blanco suave)
- **Secundario**: #3498db (Azul)
- **Acento**: #e74c3c (Rojo)
- **Fondo**: Gradiente oscuro con efectos glassmorphism
- **Texto**: #ecf0f1

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 768px para cambio mobile/desktop
- **Touch Friendly**: Botones y controles optimizados para touch
- **Swiper Integration**: Carrusel nativo para móvil

## 🔧 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/FabrizzioFederico/ConversorDinero.git
   ```

2. **Abrir el proyecto**:
   ```bash
   cd ConversorDinero
   ```

3. **Servir localmente**:
   - Abrir `index.html` en un navegador web
   - O usar un servidor local como Live Server en VS Code

4. **Configurar APIs** (opcional):
   - El proyecto funciona con APIs gratuitas
   - ExchangeRate API para conversiones
   - NewsAPI para noticias financieras

## 🌐 APIs Utilizadas

- **ExchangeRate-API**: Conversión de monedas en tiempo real
- **NewsAPI**: Noticias financieras actualizadas
- **Flag APIs**: Banderas de países por moneda

## 📊 Características Técnicas

- **Debounce**: 300ms para conversión en tiempo real
- **LocalStorage**: Persistencia de historial y preferencias
- **Responsive**: Breakpoint en 768px
- **Animaciones**: 60fps con requestAnimationFrame
- **Accesibilidad**: Contraste optimizado y navegación por teclado

## 🤝 Contribuciones

Este proyecto fue desarrollado de manera iterativa basándose en feedback continuo y mejoras específicas solicitadas durante el desarrollo.

## 📄 Licencia

Proyecto desarrollado como demostración de capacidades de desarrollo web moderno con JavaScript vanilla y CSS avanzado.

---

**Desarrollado con ❤️ usando tecnologías web modernas**