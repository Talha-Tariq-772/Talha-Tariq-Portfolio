import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer: React.FC = () => {
  const [footerRef, isFooterVisible] = useScrollAnimation<HTMLDivElement>(0.2);

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <footer className="pb-8 pt-4">
      <div
        ref={footerRef}
        className={`section-shell transition-all duration-1000 ${
          isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="glass-panel soft-ring rounded-3xl px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Talha Tariq
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                AI Engineer | MERN Web Developer
              </p>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-secondary self-start px-4 py-2 sm:self-auto"
            >
              Back to Top
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="chip normal-case tracking-normal transition duration-300 hover:-translate-y-0.5 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-slate-700/70 dark:text-slate-400">
            © {new Date().getFullYear()} Talha Tariq. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

