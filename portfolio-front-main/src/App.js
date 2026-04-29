import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AdminPanel from './components/AdminPanel';
import Contact from './components/Contact';
import Footer from './components/Footer';
import translations from './translations';

function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const isAdminPage = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update document direction and font based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.style.fontFamily = language === 'ar'
      ? "'Cairo', sans-serif"
      : "'Poppins', sans-serif";
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAdminPage && loading) {
    return (
      <div className="loader-container">
        <div className="loader-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 6}`} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }} />
          ))}
        </div>
        <div className="loader-grid-bg"></div>
        <div className="loader">
          <div className="loader-hex-ring">
            <div className="hex-segment"></div>
            <div className="hex-segment"></div>
            <div className="hex-segment"></div>
            <div className="hex-segment"></div>
            <div className="hex-segment"></div>
            <div className="hex-segment"></div>
          </div>
          <div className="loader-pulse-ring"></div>
          <div className="loader-pulse-ring delay-1"></div>
          <div className="loader-pulse-ring delay-2"></div>
          <div className="loader-image-wrapper">
            <img src={process.env.PUBLIC_URL + '/download.jpeg'} alt="Loading" className="loader-image" />
            <div className="loader-scan-line"></div>
            <div className="loader-glitch-overlay"></div>
          </div>
        </div>
        <div className="loader-text-group">
          <span className="loader-loading-text">LOADING</span>
          <div className="loader-dots">
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
          </div>
        </div>
        <div className="loader-progress-bar">
          <div className="loader-progress-fill"></div>
        </div>
      </div>
    );
  }

  if (isAdminPage) {
    return <AdminPanel />;
  }

  return (
    <div className={`App ${language === 'ar' ? 'rtl' : ''}`}>
      <Navbar
        language={language}
        setLanguage={setLanguage}
        translations={translations}
        theme={theme}
        setTheme={setTheme}
      />
      <Hero language={language} translations={translations} />
      <About language={language} translations={translations} />
      <Skills language={language} translations={translations} />
      <Projects language={language} translations={translations} />
      <Contact language={language} translations={translations} />
      <Footer language={language} translations={translations} />
    </div>
  );
}

export default App;
