import React from 'react';
import { BadgeCheck, CalendarDays, GraduationCap, MapPin } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const focusAreas = [
  'Scalable MERN application architecture',
  'Professional UI systems with smooth micro-interactions',
  'AI-powered features for business products',
  'Readable, maintainable, and reusable codebases',
];

const About: React.FC = () => {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [contentRef, isContentVisible] = useScrollAnimation<HTMLDivElement>(0.2);

  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="section-shell">
        <div
          ref={titleRef}
          className={`text-center transition-all duration-1000 ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="section-title">
            About <span className="text-blue-600 dark:text-blue-300">Me</span>
          </h2>
          <p className="section-subtitle">
            A professional engineering approach focused on business web systems and AI software.
          </p>
        </div>

        <div
          ref={contentRef}
          className={`mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] transition-all duration-1000 ${
            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <article className="glass-panel soft-ring rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Journey & Approach
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              I build professional MERN web applications and AI software designed for real business
              use cases. I turn product requirements into responsive interfaces, reliable APIs, and
              intelligent workflows that solve practical problems.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              My workflow balances speed with quality: structured components, consistent visual
              language, and practical optimization for performance, usability, and business value.
            </p>

            <div className="mt-6 grid gap-3">
              {focusAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/70"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{area}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="glass-panel soft-ring rounded-3xl p-6">
              <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
                Education
              </h4>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  BS Computer Science
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  Quaid-i-Azam University
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  2022 - 2026
                </div>
              </div>
            </div>

            <div className="glass-panel soft-ring rounded-3xl p-6">
              <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
                Current Focus
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Shipping production-ready web systems with MERN</li>
                <li>Designing scalable architecture and polished UX</li>
                <li>Building AI software for automation and prediction workflows</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
