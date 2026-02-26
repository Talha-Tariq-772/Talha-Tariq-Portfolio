import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type Category =
  | 'All'
  | 'Web Development'
  | 'AI Engineering'
  | 'NLP Solutions';

interface Project {
  title: string;
  description: string;
  techStack: string[];
  category: Exclude<Category, 'All'>;
  liveUrl?: string;
  codeUrl?: string;
  image: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'Ebn Al Arab',
    description:
      'A production-ready business website with responsive pages, clear service presentation, and professional brand-focused UI.',
    techStack: ['React', 'Node.js', 'Responsive UI'],
    category: 'Web Development',
    liveUrl: 'https://ebnalarab.com',
    image:
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    featured: true,
  },
  {
    title: 'Albark LS',
    description:
      'A modern web platform focused on clarity, trust, and conversion with smooth interactions and mobile-first layout behavior.',
    techStack: ['React', 'JavaScript', 'UI/UX'],
    category: 'Web Development',
    liveUrl: 'https://albarkls.com',
    image:
      'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    featured: true,
  },
  {
    title: 'Porta Cabins Online',
    description:
      'A catalog and inquiry-ready website designed for product visibility, clear content hierarchy, and strong lead capture intent.',
    techStack: ['MERN', 'REST API', 'SEO-Friendly'],
    category: 'Web Development',
    liveUrl: 'https://portacabins.online',
    image:
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    featured: true,
  },
  {
    title: 'Rapid Kitchen',
    description:
      'A sleek service website with structured menus, modern visual language, and polished animations for a premium customer journey.',
    techStack: ['React', 'CSS', 'Performance'],
    category: 'Web Development',
    liveUrl: 'https://rapidkitchen.com',
    image:
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    featured: true,
  },
  {
    title: 'Disease Prediction System',
    description:
      'Cloud-based machine learning system that predicts likely diseases from symptom input using supervised models.',
    techStack: ['Python', 'Scikit-learn', 'Flask', 'Streamlit'],
    category: 'AI Engineering',
    codeUrl: 'https://github.com/Talha-Tariq-772/Disease_Predictor_ML_Project',
    liveUrl: 'https://diseasepredictormlproject-gd2sfquwaeamoxsuc4gpwn.streamlit.app/',
    image:
      'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  },
  {
    title: 'Movie Recommender System',
    description:
      'Recommendation engine using collaborative and content-based filtering to improve personalization and engagement.',
    techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
    category: 'AI Engineering',
    codeUrl:
      'https://github.com/Talha-Tariq-772/Machine-Learning-Projects/tree/main/Day%2014-%20Movie%20Reccomendation%20System',
    image:
      'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  },
  {
    title: 'AI Recipe Bot',
    description:
      'An intent-aware recipe assistant that generates meal suggestions and step-by-step instructions from user-provided ingredients.',
    techStack: ['Python', 'NLP', 'TF-IDF', 'Flask'],
    category: 'AI Engineering',
    codeUrl: 'https://github.com/Talha-Tariq-772/Recipes-ChatBot',
    liveUrl: 'https://intent-recipe-chatbot.streamlit.app/',
    image:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  },
  {
    title: 'AI Plagiarism Checker',
    description:
      'A plagiarism analysis tool that compares submitted text against reference corpora and provides explainable similarity scoring.',
    techStack: ['Python', 'Transformers', 'Scikit-learn', 'NLP'],
    category: 'NLP Solutions',
    codeUrl: 'https://github.com/Talha-Tariq-772/Plagiarism-Checker',
    image:
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  },
  {
    title: 'Disaster Tweets Detector',
    description:
      'Real-time NLP pipeline that classifies emergency-related tweets for faster public-alert and response workflows.',
    techStack: ['Python', 'TensorFlow', 'Twitter API', 'NLP'],
    category: 'AI Engineering',
    codeUrl: 'https://github.com/Talha-Tariq-772/Machine-Learning-Projects',
    image:
      'https://images.pexels.com/photos/73833/hurricane-earth-satellite-tracking-73833.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  },
];

const getDomainLabel = (url?: string) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<Category>('All');
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [projectsRef, isProjectsVisible] = useScrollAnimation<HTMLDivElement>(0.1);

  const categories: Category[] = [
    'All',
    ...Array.from(new Set(projects.map((project) => project.category))),
  ] as Category[];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="projects" className="py-20 sm:py-24">
      <div className="section-shell">
        <div
          ref={titleRef}
          className={`text-center transition-all duration-1000 ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="section-title">
            Featured <span className="text-blue-600 dark:text-blue-300">Projects</span>
          </h2>
          <p className="section-subtitle">
            A professional showcase of business web systems and AI software products.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:text-blue-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-blue-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          ref={projectsRef}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredProjects.map((project, index) => (
            <article
              key={project.title}
              className={`group glass-panel soft-ring relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 ${
                isProjectsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${Math.min(index * 90, 420)}ms` }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900">
                      Live Project
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {project.title}
                </h3>
                {project.liveUrl && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                    {getDomainLabel(project.liveUrl)}
                  </p>
                )}
                <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={`${project.title}-${tech}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-4 py-2 text-xs"
                    >
                      <Github className="mr-1.5 h-3.5 w-3.5" />
                      Source
                    </a>
                  )}

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-4 py-2 text-xs"
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Visit Site
                    </a>
                  ) : (
                    <span className="btn-secondary cursor-default px-4 py-2 text-xs opacity-75">
                      Live Demo Unavailable
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

