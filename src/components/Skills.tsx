import React from 'react';
import { BrainCircuit, Database, MonitorSmartphone, Sparkles, Wrench } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const skillGroups = [
  {
    title: 'MERN Stack',
    icon: <Database className="h-5 w-5" />,
    color: 'from-blue-600 to-cyan-500',
    skills: [
      'MongoDB',
      'Express.js',
      'React.js',
      'Node.js',
      'REST APIs',
      'JWT Auth',
      'Mongoose',
      'Deployment',
    ],
  },
  {
    title: 'Frontend Engineering',
    icon: <MonitorSmartphone className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-500',
    skills: [
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Component Design',
      'Motion UX',
      'Responsive Layouts',
      'Accessibility',
      'Performance',
    ],
  },
  {
    title: 'AI Engineering Toolkit',
    icon: <BrainCircuit className="h-5 w-5" />,
    color: 'from-violet-500 to-fuchsia-500',
    skills: [
      'Python',
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'OpenCV',
      'Pandas',
      'NLTK',
      'Transformers',
    ],
  },
  {
    title: 'Dev Workflow',
    icon: <Wrench className="h-5 w-5" />,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      'Git & GitHub',
      'VS Code',
      'Postman',
      'Linux CLI',
      'Debugging',
      'Testing Basics',
      'SEO Basics',
      'Cloud Deployments',
    ],
  },
];

const marqueeSkills = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'TypeScript',
  'Tailwind CSS',
  'Python',
  'TensorFlow',
  'PyTorch',
  'NLP',
  'REST APIs',
  'System Design',
  'Automation',
];

const topSkills = [
  { name: 'MERN Stack Development', color: 'from-blue-600 to-cyan-500' },
  { name: 'AI Software Engineering', color: 'from-violet-600 to-fuchsia-500' },
  { name: 'Business Web Systems', color: 'from-emerald-500 to-teal-500' },
  { name: 'REST API Architecture', color: 'from-sky-500 to-blue-600' },
  { name: 'Automation Workflows', color: 'from-amber-500 to-orange-500' },
  { name: 'NLP-Powered Solutions', color: 'from-indigo-500 to-violet-600' },
  { name: 'Scalable Backend Design', color: 'from-cyan-500 to-blue-500' },
  { name: 'Responsive UI Engineering', color: 'from-orange-500 to-rose-500' },
];

const orbitSkills = ['React', 'Node', 'MongoDB', 'Python', 'TensorFlow', 'NLP', 'APIs', 'UX'];

const deliveryStrengths = [
  { label: 'Business Web Systems', value: 96, color: 'from-blue-600 to-cyan-500' },
  { label: 'AI Software Solutions', value: 91, color: 'from-violet-600 to-fuchsia-500' },
  { label: 'Performance Optimization', value: 89, color: 'from-amber-500 to-orange-500' },
  { label: 'Scalable Architecture', value: 93, color: 'from-emerald-500 to-teal-500' },
];

const Skills: React.FC = () => {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [topSkillsRef, isTopSkillsVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [groupsRef, visibleGroups] = useStaggeredAnimation<HTMLDivElement>(skillGroups.length, 130);
  const [showcaseRef, isShowcaseVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [metricsRef, isMetricsVisible] = useScrollAnimation<HTMLDivElement>(0.2);

  return (
    <section id="skills" className="relative py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="skills-ambient skills-ambient-one" />
        <div className="skills-ambient skills-ambient-two" />
        <div className="skills-ambient skills-ambient-three" />
      </div>

      <div className="section-shell">
        <div
          ref={titleRef}
          className={`text-center transition-all duration-1000 ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="section-title">
            Technical <span className="text-blue-600 dark:text-blue-300">Capabilities</span>
          </h2>
          <p className="section-subtitle">
            End-to-end web development with MERN plus production-focused AI software engineering.
          </p>
        </div>

        <div
          className={`mt-8 transition-all duration-1000 ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="skill-marquee glass-panel soft-ring rounded-2xl px-2 sm:px-3">
            <div className="skill-marquee-track">
              {[...marqueeSkills, ...marqueeSkills].map((skill, index) => (
                <span key={`${skill}-${index}`} className="skill-marquee-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={topSkillsRef}
          className={`mt-7 transition-all duration-1000 ${
            isTopSkillsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="glass-panel soft-ring rounded-3xl p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              <h3 className="font-display text-xl font-semibold">Top Skills</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {topSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className={`rounded-2xl border border-slate-200/70 bg-white/80 p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-900/70 ${
                    isTopSkillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${index * 85}ms` }}
                >
                  <span
                    className={`mb-2 inline-block h-1.5 w-16 rounded-full bg-gradient-to-r ${skill.color}`}
                  />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={groupsRef} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <article
              key={group.title}
              className={`group glass-panel soft-ring relative overflow-hidden rounded-3xl p-6 transition-all duration-700 hover:-translate-y-1 ${
                visibleGroups[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div aria-hidden className="skill-card-sweep" />

              <div className="relative z-10 mb-5 flex items-center gap-3">
                <div
                  className={`rounded-xl bg-gradient-to-r ${group.color} p-2.5 text-white shadow-lg`}
                >
                  {group.icon}
                </div>
                <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {group.title}
                </h3>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2.5">
                {group.skills.map((skill) => (
                  <span
                    key={`${group.title}-${skill}`}
                    className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div
          ref={showcaseRef}
          className={`mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 transition-all duration-1000 ${
            isShowcaseVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <article className="glass-panel soft-ring rounded-3xl p-6 sm:p-7">
            <span className="chip normal-case tracking-normal">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Animated Skill Map
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Full-Stack + AI Engine
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              A visual snapshot of the technologies I combine to ship modern business systems.
            </p>

            <div className="mt-6 flex justify-center">
              <div className="skill-orbit-frame">
                <div className="skill-orbit-ring" />
                <div className="skill-orbit-spin">
                  {orbitSkills.map((skill, index) => {
                    const angle = (360 / orbitSkills.length) * index;
                    return (
                      <span
                        key={skill}
                        className="skill-orbit-node"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-132px)`,
                        }}
                      >
                        <span className="skill-orbit-counter">{skill}</span>
                      </span>
                    );
                  })}
                </div>

                <div className="skill-orbit-center">
                  <p className="skill-orbit-core">
                    AI + MERN
                    <span className="block text-xs font-semibold uppercase tracking-wide text-blue-700/80 dark:text-blue-200/85">
                      Delivery Stack
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="glass-panel soft-ring rounded-3xl p-6 sm:p-7">
            <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Execution Strength
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Capability areas I prioritize when building user-facing and business-critical systems.
            </p>

            <div className="mt-6 space-y-4">
              {deliveryStrengths.map((strength, index) => (
                <div key={strength.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {strength.label}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {strength.value}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${strength.color} transition-all duration-1000 ease-out`}
                      style={{
                        width: isShowcaseVisible ? `${strength.value}%` : '0%',
                        transitionDelay: `${index * 130}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div
          ref={metricsRef}
          className={`mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 transition-all duration-1000 ${
            isMetricsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {[
            { value: '15+', label: 'Projects Completed' },
            { value: '2+', label: 'Years Experience' },
            { value: 'MERN', label: 'Web Development Core' },
            { value: 'AI', label: 'Business System Integrations' },
          ].map((metric, index) => (
            <div
              key={metric.label}
              className={`glass-panel soft-ring rounded-2xl px-4 py-5 text-center transition-all duration-500 hover:-translate-y-1 ${
                isMetricsVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <p className="font-display text-3xl font-semibold text-blue-600 dark:text-blue-300">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
