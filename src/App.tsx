import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SEO from './components/SEO';
import Chatbot from './components/Chatbot';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedMode = window.localStorage.getItem('darkMode');
      return savedMode === null ? true : JSON.parse(savedMode);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <SEO />
      <div className="relative min-h-screen overflow-x-hidden">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-drift" />
          <div className="absolute -right-20 top-[32%] h-80 w-80 rounded-full bg-amber-400/20 blur-3xl animate-drift" />
          <div className="absolute bottom-16 left-[40%] h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl animate-drift" />
        </div>

        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)} />

        <main className="pt-16 sm:pt-20">
          <Hero />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </main>

        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
