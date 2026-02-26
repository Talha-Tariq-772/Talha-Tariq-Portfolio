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
    const handleScroll = () => setScrolled(window.scrollY > 22);
    window.addEventListener('scroll', handleScroll);
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

    const headerOffset = 82;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/78 shadow-xl shadow-slate-300/20 backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-950/76 dark:shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-shell">
        <div className="flex h-16 items-center justify-between sm:h-[74px]">
          <button
            onClick={() => scrollToSection('#hero')}
            className="text-left transition duration-300 hover:opacity-85"
          >
            <span className="font-display block text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Talha Tariq
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              AI Engineer | MERN Web Developer
            </span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800/75 dark:hover:text-blue-300"
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="ml-2 rounded-xl border border-slate-300/75 bg-white/70 p-2.5 text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="rounded-lg border border-slate-300/70 bg-white/70 p-2 text-slate-700 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Open menu"
              className="rounded-lg border border-slate-300/70 bg-white/70 p-2 text-slate-700 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

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
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition duration-300 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
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

