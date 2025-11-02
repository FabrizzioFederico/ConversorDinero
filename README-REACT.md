# 💱 F&M Rates - React Version

Una aplicación web moderna para conversión de monedas en tiempo real con cálculo de impuestos argentinos, construida con React.

## 🚀 Nuevas Características en React

### ✨ Mejoras de la Migración
- **Arquitectura React**: Componentes reutilizables y estado manejado con hooks
- **React Router**: Navegación fluida entre páginas sin recargas
- **Vite**: Build tool ultra rápido para desarrollo y producción
- **Página Acerca de**: Información completa sobre la aplicación
- **Página de Contacto**: Formulario interactivo que muestra los datos ingresados
- **Exportación JSON**: Descarga todas tus conversiones en formato JSON

## 📋 Páginas

### 🏠 Inicio
- Conversor de monedas en tiempo real
- Historial de conversiones con paginación
- Cálculo de impuestos argentinos
- Exportación de conversiones a JSON

### ℹ️ Acerca de
- Información sobre la aplicación
- Características principales
- Tecnologías utilizadas
- Detalles de la API

### 📧 Contacto
- Formulario de contacto interactivo
- Visualización de datos enviados
- Información de contacto adicional

## 🛠️ Tecnologías

- **React 18**: Framework principal
- **React Router 6**: Navegación entre páginas
- **Vite**: Build tool moderno
- **Exchange Rate API**: Tasas de cambio en tiempo real
- **CSS3**: Diseño glassmorphism con variables CSS

## 📦 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

3. **Compilar para producción:**
```bash
npm run build
```

4. **Vista previa de producción:**
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
ConversorDinero/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── Converter.jsx
│   │   ├── Converter.css
│   │   ├── History.jsx
│   │   └── History.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Contact.jsx
│   │   └── Contact.css
│   ├── services/
│   │   └── currencyAPI.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index-react.html
├── package.json
├── vite.config.js
└── README-REACT.md
```

## 🌟 Características Principales

### 💰 Conversión de Monedas
- Conversión en tiempo real mientras escribes
- Más de 40 monedas internacionales
- Intercambio rápido de divisas
- Visualización de tasas de cambio

### 🇦🇷 Sistema de Impuestos Argentinos
- Cálculo automático para conversiones a ARS
- IVA del 21%
- Impuesto a las Ganancias del 30%
- Exención para compras gaming
- Desglose detallado de impuestos

### 💾 Gestión de Historial
- Guardado automático en localStorage
- Paginación (5 conversiones por página)
- Eliminación de conversiones
- Exportación completa a JSON
- Persistencia de datos entre sesiones

### 🎨 Diseño Moderno
- Glassmorphism design
- Modo oscuro/claro con persistencia
- Diseño 100% responsive
- Animaciones fluidas
- Navegación intuitiva

## 🔄 Funcionalidad de Exportación JSON

La aplicación permite exportar todas las conversiones guardadas en formato JSON:

1. Click en "📥 Exportar JSON" en el historial
2. Se descarga un archivo `conversiones_YYYY-MM-DD.json`
3. El archivo contiene todas las conversiones con:
   - Fecha y hora
   - Monedas de origen y destino
   - Cantidades y tasas de cambio
   - Información de impuestos (si aplica)

### Ejemplo de JSON exportado:
```json
[
  {
    "id": 1698765432000,
    "date": "2025-11-02T10:30:00.000Z",
    "amount": 100,
    "fromCurrency": "USD",
    "toCurrency": "ARS",
    "result": 151000,
    "exchangeRate": 1000,
    "taxBreakdown": {
      "base": 100000,
      "iva": 21000,
      "ganancias": 30000,
      "total": 151000
    },
    "isGamingPurchase": false
  }
]
```

## 🌐 API de Tipos de Cambio

Utilizamos **Exchange Rate API** (https://www.exchangerate-api.com) para obtener tasas de cambio actualizadas diariamente.

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notas Importantes

- Los tipos de cambio son referenciales
- Se actualizan diariamente
- Esta es una herramienta de referencia, no asesoramiento financiero
- Los datos se guardan localmente en tu navegador

## 👨‍💻 Desarrollo

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa de la build de producción

### Variables de Entorno

No se requieren variables de entorno. La API utilizada es de acceso público.

## 🔜 Próximas Mejoras

- [ ] Gráficos históricos de tasas de cambio
- [ ] Comparación de múltiples monedas
- [ ] Alertas de tasas de cambio
- [ ] Modo offline con Service Workers
- [ ] Integración con más APIs de tasas

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- Exchange Rate API por proporcionar las tasas de cambio
- Comunidad de React por las herramientas increíbles
- Flagcdn.com por las banderas de países

---

**Desarrollado con ❤️ por F&M Team**

*Versión React 2.0.0 - Noviembre 2025*
