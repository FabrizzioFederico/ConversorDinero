import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [conversions, setConversions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Cargar tema guardado
  useEffect(() => {
    // Deshabilitar transiciones temporalmente
    document.documentElement.style.setProperty('--theme-transition-duration', '0s');
    
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Restaurar transiciones después de que se cargue la página
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--theme-transition-duration', '0.5s');
    });
  }, []);

  // Cargar conversiones desde localStorage
  useEffect(() => {
    const savedConversions = localStorage.getItem('conversions');
    if (savedConversions) {
      setConversions(JSON.parse(savedConversions));
    }
  }, []);

  // Guardar conversiones en localStorage
  useEffect(() => {
    localStorage.setItem('conversions', JSON.stringify(conversions));
  }, [conversions]);

  const toggleTheme = () => {
    // Agregar clase theme-changing
    document.documentElement.classList.add('theme-changing');
    
    const newTheme = !isDarkMode;
    
    // Cambiar tema después de un pequeño delay
    setTimeout(() => {
      setIsDarkMode(newTheme);
      localStorage.setItem('darkMode', newTheme.toString());
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      
      // Remover clase después de la transición
      setTimeout(() => {
        document.documentElement.classList.remove('theme-changing');
      }, 600);
    }, 50);
  };

  const handleConversionSave = (conversion) => {
    setConversions(prev => [conversion, ...prev]);
  };

  const handleDelete = (id) => {
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  const handleEdit = (id, updatedConversion) => {
    setConversions(prev => prev.map(c => 
      c.id === id ? { ...c, ...updatedConversion } : c
    ));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(conversions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `conversiones_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app">
      {/* Botón hamburguesa global */}
      <div 
        className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`} 
        id="menuToggle"
        onClick={toggleSidebar}
      >
        <span className="hamburger"></span>
      </div>

      {/* Sidebar global */}
      <Sidebar 
        conversions={conversions}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onExport={handleExport}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <Routes>
        <Route path="/" element={<Home onConversionSave={handleConversionSave} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
