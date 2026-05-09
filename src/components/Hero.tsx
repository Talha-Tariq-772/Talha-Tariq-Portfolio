import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  Brain,
  Code2,
  Database,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import MyCV from './Talha_Tariq_CV.pdf';
import profileImage from '../profile1.png';

const rotatingHighlights = [
  'AI Software Products',
  'Business Automation Systems',
  'Scalable MERN Applications',
  'Intelligent Web Platforms',
];

const Hero: React.FC = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation<HTMLElement>(0.2);
  const [copyRef, isCopyVisible] = useScrollAnimation<HTMLDivElement>(0.25);
  const [mediaRef, isMediaVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 28 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % rotatingHighlights.length);
    }, 2700);
    return () => window.clearInterval(interval);
  }, []);

  const handleHeroMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleHeroMove}
      onMouseLeave={() => setSpotlight({ x: 50, y: 28 })}
      style={{ '--spot-x': `${spotlight.x}%`, '--spot-y': `${spotlight.y}%` } as React.CSSProperties}
      className="hero-funky relative pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pb-36"
    >
      <div aria-hidden className="hero-grid" />
      <div aria-hidden className="hero-blob hero-blob-one" />
      <div aria-hidden className="hero-blob hero-blob-two" />
      <div aria-hidden className="hero-blob hero-blob-three" />
      <div aria-hidden className="hero-blob hero-blob-four" />

      <div className="section-shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ── LEFT: Copy ── */}
          <div
            ref={copyRef}
            className={`transition-all duration-1000 ${
              isCopyVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            {/* Availability badge */}
            <div className="hero-avail-badge">
              <span className="hero-avail-dot" />
              Available for Projects
            </div>

            {/* Main headline */}
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.06] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[4.2rem]">
              I Build{' '}
              <span className="hero-gradient-text">AI-Powered</span>
              <br className="hidden sm:block" />
              {' '}Software{' '}
              <span className="relative inline-block">
                Products
                <span className="hero-word-underline" />
              </span>
            </h1>

            {/* Tagline badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3.5 py-1.5 dark:border-indigo-900/50 dark:bg-indigo-950/40">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
                AI Engineer + MERN Web Developer
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[1.05rem]">
              I design and ship responsive business websites, full-stack MERN applications, and AI
              software for automation, prediction, and intelligent business workflows.
            </p>

            {/* Rotating highlight */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Currently shipping</span>
              <span className="text-indigo-400 dark:text-indigo-400">›</span>
              <span key={activeHighlight} className="hero-rotating-word animate-fade-up">
                {rotatingHighlights[activeHighlight]}
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="hero-cta-primary hero-btn-shimmer hero-cta-pulse">
                View Projects
                <ArrowDownRight className="ml-2 h-4 w-4" />
              </a>
              <a href={MyCV} download className="hero-cta-secondary">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
              <a href="mailto:tariqtalha772@gmail.com" className="btn-ghost">
                <Mail className="mr-2 h-4 w-4" />
                Email Me
              </a>
            </div>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com/Talha-Tariq-772"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-btn"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/talha-tariq-81a85a35a"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-btn"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </div>

            {/* Tech chips */}
            <div className="mt-6 flex flex-wrap gap-2">
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

            {/* Service mini-cards */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="hero-service-card glass-panel soft-ring relative overflow-hidden rounded-2xl p-4">
                <div className="hero-service-accent hero-service-accent-blue" />
                <div className="mb-2 flex items-center gap-2">
                  <div className="hero-service-icon bg-blue-500/10">
                    <Code2 className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    Web Development
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Professional business websites, dashboards, and scalable MERN web apps.
                </p>
              </div>
              <div className="hero-service-card glass-panel soft-ring relative overflow-hidden rounded-2xl p-4">
                <div className="hero-service-accent hero-service-accent-violet" />
                <div className="mb-2 flex items-center gap-2">
                  <div className="hero-service-icon bg-violet-500/10">
                    <Brain className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                    AI Solutions
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Intelligent systems and model-powered software integrated into real products.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Media ── */}
          <div
            ref={mediaRef}
            className={`relative transition-all duration-1000 delay-200 lg:-mt-10 ${
              isMediaVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            <div className="relative mx-auto max-w-[380px]">
              {/* Ambient glow behind image */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 translate-y-[10%] scale-[0.85] opacity-75"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.55), rgba(6,182,212,0.3) 50%, transparent 72%)',
                  filter: 'blur(48px)',
                  borderRadius: '999px',
                }}
              />

              {/* Profile image — transparent bg blends with page aurora */}
              <div
                className="aspect-[4/5] overflow-hidden rounded-3xl"
                style={{ background: 'transparent' }}
              >
                <img
                  src={profileImage}
                  alt="Talha Tariq"
                  className="h-full w-full object-contain object-center"
                  loading="eager"
                />
              </div>

              {/* Floating tech badges */}
              <div className="hero-badge hero-float-badge-tl animate-float delay-100">
                <Zap className="h-3 w-3 text-amber-500" />
                React
              </div>
              <div className="hero-badge hero-float-badge-tr animate-float delay-300">
                <Database className="h-3 w-3 text-green-500" />
                Node.js
              </div>
              <div className="hero-badge hero-float-badge-bl animate-float delay-200">
                <Database className="h-3 w-3 text-emerald-500" />
                MongoDB
              </div>
              <div className="hero-badge hero-float-badge-br animate-float">
                <Brain className="h-3 w-3 text-violet-500" />
                AI / ML
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="hero-stat-card glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="hero-stat-number text-blue-600 dark:text-blue-400">15+</p>
                <p className="hero-stat-label">Projects</p>
              </div>
              <div className="hero-stat-card glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="hero-stat-number text-amber-600 dark:text-amber-400">MERN</p>
                <p className="hero-stat-label">Core Stack</p>
              </div>
              <div className="hero-stat-card glass-panel soft-ring rounded-2xl px-3 py-4">
                <p className="hero-stat-number text-violet-600 dark:text-violet-400">AI</p>
                <p className="hero-stat-label">Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote banner */}
      <div
        className={`section-shell relative z-10 mt-14 transition-all duration-1000 ${
          isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="glass-panel soft-ring relative overflow-hidden rounded-3xl p-5 sm:p-7">
          <div className="hero-quote-shimmer" />
          <div className="relative z-10 flex items-center justify-center gap-3">
            <span className="hero-quote-mark">&ldquo;</span>
            <p className="text-center text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              I combine enterprise-grade web engineering with AI software development so businesses
              can{' '}
              <strong className="font-semibold text-slate-900 dark:text-slate-100">
                launch faster
              </strong>
              , automate smarter, and scale confidently.
            </p>
            <span className="hero-quote-mark">&rdquo;</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span className="hero-scroll-label">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
