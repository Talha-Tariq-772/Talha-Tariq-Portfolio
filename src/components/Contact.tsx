import React, { useState } from 'react';
import { Github, Linkedin, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const base = import.meta.env.VITE_API_BASE_URL;

const Contact: React.FC = () => {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [leftRef, isLeftVisible] = useScrollAnimation<HTMLDivElement>(0.2);
  const [rightRef, isRightVisible] = useScrollAnimation<HTMLDivElement>(0.2);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormFeedback('Sending your message...');

    try {
      if (!base) {
        throw new Error('Missing VITE_API_BASE_URL for contact API.');
      }

      const response = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Contact API response status:', response.status);
      console.log('Contact API response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();
      let data: { message?: string; error?: string; details?: string; success?: boolean } = {};

      if (contentType.includes('application/json')) {
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          data = { error: 'Invalid JSON response from server.' };
        }
      } else {
        const trimmed = raw.trim();
        const looksLikeHtml = trimmed.startsWith('<');
        data = {
          error: looksLikeHtml
            ? 'Unexpected response from server.'
            : trimmed || 'Empty response from server.',
        };
      }

      if (!response.ok || data?.success === false) {
        const detail = data?.error || data?.details || 'Request failed';
        throw new Error(detail);
      }

      setFormStatus('success');
      setFormFeedback(data?.message || 'Thanks for reaching out! I will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus('error');
      setFormFeedback(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'tariqtalha772@gmail.com',
      href: 'mailto:tariqtalha772@gmail.com',
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: '03256525755',
      href: 'tel:+923256525755',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'WhatsApp',
      value: '03256525755',
      href: 'https://wa.me/923256525755?text=Hi%20Talha%2C%20I%20want%20to%20discuss%20a%20project.',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: 'Pakistan',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="section-shell">
        <div
          ref={titleRef}
          className={`text-center transition-all duration-1000 ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="section-title">
            Let&apos;s Build <span className="text-blue-600 dark:text-blue-300">Something Great</span>
          </h2>
          <p className="section-subtitle">
            Open for business websites, web applications, and AI software projects.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            ref={leftRef}
            className={`space-y-4 transition-all duration-1000 ${
              isLeftVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <article className="glass-panel soft-ring rounded-3xl p-6">
              <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Contact Details
              </h3>
              <div className="mt-5 space-y-3">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:border-blue-500"
                  >
                    <span className="rounded-xl bg-blue-600/10 p-2 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                      {info.icon}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {info.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {info.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </article>

            <article className="glass-panel soft-ring rounded-3xl p-6">
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
                Social Profiles
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-3">
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
                <a
                  href="https://wa.me/923256525755?text=Hi%20Talha%2C%20I%20want%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary border-emerald-300/70 bg-emerald-50/80 px-4 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100/80 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:border-emerald-400"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </article>
          </div>

          <div
            ref={rightRef}
            className={`glass-panel soft-ring rounded-3xl p-6 sm:p-8 transition-all duration-1000 ${
              isRightVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Send a Message
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Share your website or AI software requirements and timeline. I will respond as soon
              as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/25"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/25"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/25"
                  placeholder="Tell me about your project"
                />
              </div>

              {formStatus !== 'idle' && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    formStatus === 'success'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-900/25 dark:text-emerald-100'
                      : formStatus === 'error'
                        ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-700/50 dark:bg-red-900/25 dark:text-red-100'
                        : 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700/50 dark:bg-blue-900/25 dark:text-blue-100'
                  }`}
                  aria-live="polite"
                >
                  {formFeedback}
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className={`btn-primary w-full ${formStatus === 'sending' ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                {formStatus === 'sending' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

