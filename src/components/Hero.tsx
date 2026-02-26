import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import MyCV from './Talha_Tariq_CV.pdf';
import profileImage from '../profile.jpg';

const rotatingHighlights = [
  'AI Software Products',
  'Business Automation Systems',
  'Scalable MERN Applications',
  'Intelligent Web Platforms',
];

const Hero: React.FC = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation<HTMLSectionElement>(0.2);
  const [copyRef, isCopyVisible] = useScrollAnimation<HTMLDivElement>(0.25);
  const [mediaRef, isMediaVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 28 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % rotatingHighlights.length);
    }, 2300);

    return () => window.clearInterval(interval);
  }, []);

  const handleHeroMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  const handleCardMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - py) * 10,
      y: (px - 0.5) * 12,
    });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={() => setSpotlight({ x: 50, y: 28 })}
      style={{
        '--spot-x': `${spotlight.x}%`,
        '--spot-y': `${spotlight.y}%`,
      } as React.CSSProperties}
      className="hero-funky relative pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28"
    >
      <div aria-hidden className="hero-grid" />
      <div aria-hidden className="hero-blob hero-blob-one" />
      <div aria-hidden className="hero-blob hero-blob-two" />
      <div aria-hidden className="hero-blob hero-blob-three" />

      <div className="section-shell relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          <div
            ref={copyRef}
            className={`transition-all duration-1000 ${
              isCopyVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="chip hero-tagline-glow animate-pulse-glow">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              AI Software + Business Web Systems
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
              Delivering modern products as an
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 bg-clip-text text-transparent">
                AI Engineer + MERN Web Developer
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              I design and ship responsive business websites, full-stack MERN applications, and AI
              software for automation, prediction, and intelligent business workflows.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Currently shipping:</span>
              <span key={activeHighlight} className="hero-rotating-word animate-fade-up">
                {rotatingHighlights[activeHighlight]}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary hero-cta-pulse">
                View Projects
                <ArrowDownRight className="ml-2 h-4 w-4" />
              </a>
              <a href={MyCV} download className="btn-secondary">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
              <a href="mailto:tariqtalha772@gmail.com" className="btn-ghost">
                <Mail className="mr-2 h-4 w-4" />
                tariqtalha772@gmail.com
              </a>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://github.com/Talha-Tariq-772"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-4"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/talha-tariq-81a85a35a"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-4"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              {[
                'Business Web Systems',
                'MERN Architecture',
                'AI Software Engineering',
                'Performance Focus',
              ].map((item) => (
                <span key={item} className="chip normal-case tracking-normal">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="glass-panel soft-ring rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                  Web Development Services
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Professional business websites, dashboards, and scalable MERN web apps.
                </p>
              </div>
              <div className="glass-panel soft-ring rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                  AI Software Solutions
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Intelligent systems and model-powered software integrated into real products.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={mediaRef}
            className={`relative transition-all duration-1000 ${
              isMediaVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div
              className="hero-tilt-shell"
              onMouseMove={handleCardMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <div className="glass-panel soft-ring relative overflow-hidden p-5 sm:p-6">
                <div aria-hidden className="hero-card-glow" />
                <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-blue-500/25 blur-3xl" />
                <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-amber-400/25 blur-3xl" />

                <div className="relative">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/70 p-3 dark:bg-slate-900/60">
                    <img
                      src={profileImage}
                      alt="Talha Tariq"
                      className="h-full w-full object-contain object-center"
                      loading="eager"
                    />
                  </div>

                  <div className="animate-float absolute -left-3 top-6 rounded-xl border border-white/60 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 dark:border-slate-600/70 dark:bg-slate-900/85 dark:text-slate-200">
                    Production-Focused Delivery
                  </div>

                  <div className="animate-float absolute -right-3 bottom-16 rounded-xl border border-white/60 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 dark:border-slate-600/70 dark:bg-slate-900/85 dark:text-slate-200">
                    Web + AI Solutions
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="font-display text-2xl font-semibold text-blue-600 dark:text-blue-300">15+</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Projects</p>
              </div>
              <div className="glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="font-display text-2xl font-semibold text-amber-600 dark:text-amber-300">MERN</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Core Stack</p>
              </div>
              <div className="glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="font-display text-2xl font-semibold text-cyan-600 dark:text-cyan-300">AI</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Intelligence Driven</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`section-shell relative z-10 mt-14 transition-all duration-1000 ${
          isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="glass-panel soft-ring rounded-3xl p-5 sm:p-6">
          <p className="text-center text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            I combine enterprise-grade web engineering with AI software development so businesses
            can launch faster, automate smarter, and scale confidently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
