import React, { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (!element) return;
    const headerOffset = 80;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    setIsOpen(false);
  };

  /* Text always readable in both light and dark mode, scrolled and non-scrolled */
  const navTextClass = scrolled
    ? 'text-slate-800 dark:text-slate-100'
    : 'text-slate-800 dark:text-white';

  const navHoverClass = scrolled
    ? 'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300'
    : 'hover:bg-indigo-100/60 hover:text-indigo-700 dark:hover:bg-white/10 dark:hover:text-indigo-200';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-white/92 shadow-lg shadow-indigo-900/8 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-[#07091a]/92 dark:shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-shell">
        <div className="flex h-16 items-center justify-between sm:h-[74px]">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#hero')}
            className="text-left transition duration-300 hover:opacity-85"
          >
            <span
              className="font-display block text-sm font-bold uppercase tracking-[0.2em]"
              style={{
                background: 'linear-gradient(92deg, #818cf8, #a78bfa, #67e8f9)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Talha Tariq
            </span>
            <span className={`text-xs font-medium transition-colors duration-500 ${scrolled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
              AI Engineer | MERN Web Developer
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${navTextClass} ${navHoverClass}`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className={`ml-2 rounded-xl p-2.5 transition duration-300 hover:-translate-y-0.5 ${
                scrolled
                  ? 'border border-indigo-200/60 bg-white/70 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300'
                  : 'border border-slate-300/60 bg-white/30 text-slate-700 hover:bg-white/50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className={`rounded-lg p-2 transition ${
                scrolled
                  ? 'border border-indigo-200/60 bg-white/70 text-slate-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-slate-300'
                  : 'border border-slate-300/60 bg-white/30 text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-white'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Open menu"
              className={`rounded-lg p-2 transition ${
                scrolled
                  ? 'border border-indigo-200/60 bg-white/70 text-slate-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-slate-300'
                  : 'border border-slate-300/60 bg-white/30 text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-white'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-500 md:hidden ${
            isOpen ? 'max-h-72 pb-4 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass-panel soft-ring space-y-1 rounded-2xl p-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 transition duration-300 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
