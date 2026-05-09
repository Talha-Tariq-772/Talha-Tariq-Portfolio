import { useEffect, useState } from 'react';
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

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <SEO />

      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <div className="relative min-h-screen overflow-x-hidden">
        {/* Ambient background blobs */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute -left-40 top-20 h-80 w-80 rounded-full animate-drift"
            style={{
              background: 'rgba(99, 102, 241, 0.18)',
              filter: 'blur(72px)',
            }}
          />
          <div
            className="absolute -right-24 top-[30%] h-96 w-96 rounded-full animate-drift"
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              filter: 'blur(80px)',
              animationDelay: '3s',
            }}
          />
          <div
            className="absolute bottom-20 left-[38%] h-72 w-72 rounded-full animate-drift"
            style={{
              background: 'rgba(139, 92, 246, 0.14)',
              filter: 'blur(64px)',
              animationDelay: '6s',
            }}
          />
        </div>

        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)} />

        <main className="pt-16 sm:pt-[74px]">
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
