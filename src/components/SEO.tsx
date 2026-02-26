/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';

const DEFAULT_SITE_URL = 'https://talhatariq.online';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
};

const SEO: React.FC = () => {
  useEffect(() => {
    const siteName = 'Talha Tariq';
    const siteTitle = 'Talha Tariq Portfolio';
    const siteDescription =
      'AI Engineer and MERN Web Developer building AI software, business systems, automation workflows, and scalable full-stack web applications.';
    const siteKeywords = [
      'AI Engineer',
      'MERN Developer',
      'MERN Stack Developer',
      'AI Software Developer',
      'Business Systems Developer',
      'Web Development Services',
      'Automation Software',
      'Machine Learning Engineer',
      'NLP Solutions',
      'Full Stack Developer',
      'React Developer',
      'Node.js Developer',
      'Express.js',
      'MongoDB',
      'Talha Tariq',
    ].join(', ');
    const siteUrl = normalizeBaseUrl(import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL);
    const canonicalUrl = `${siteUrl}${normalizePathname(window.location.pathname)}`;
    const ogImage = `${siteUrl}/og-image.jpg`;
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const whatsappUrl =
      'https://wa.me/923256525755?text=Hi%20Talha%2C%20I%20want%20to%20discuss%20a%20project.';
    const featuredProjects = [
      { name: 'Ebn Al Arab', url: 'https://ebnalarab.com/' },
      { name: 'Albark LS', url: 'https://albarkls.com/' },
      { name: 'Porta Cabins Online', url: 'https://portacabins.online/' },
      { name: 'Rapid Kitchen', url: 'https://rapidkitchen.com/' },
    ];

    const upsertMeta = (attribute: 'name' | 'property', value: string, content: string) => {
      const selector = `meta[${attribute}="${value}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    const upsertLink = (rel: string, href: string) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }

      link.setAttribute('href', href);
    };

    const upsertAlternateLink = (hreflang: 'en' | 'x-default', href: string) => {
      const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
      let link = document.head.querySelector(selector) as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }

      link.setAttribute('href', href);
    };

    document.title = siteTitle;
    document.documentElement.setAttribute('lang', 'en');

    upsertMeta('name', 'description', siteDescription);
    upsertMeta('name', 'keywords', siteKeywords);
    upsertMeta(
      'name',
      'robots',
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    );
    upsertMeta(
      'name',
      'googlebot',
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    );
    upsertMeta('name', 'author', siteName);
    upsertMeta('name', 'application-name', 'Talha Tariq Portfolio');
    upsertMeta('name', 'theme-color', '#020617');
    upsertMeta('name', 'format-detection', 'telephone=no');
    upsertMeta('name', 'referrer', 'strict-origin-when-cross-origin');

    upsertMeta('property', 'og:title', siteTitle);
    upsertMeta('property', 'og:description', siteDescription);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', 'Talha Tariq - AI Engineer and MERN Developer');
    upsertMeta('property', 'og:image:type', 'image/jpeg');
    upsertMeta('property', 'og:image:width', '800');
    upsertMeta('property', 'og:image:height', '800');
    upsertMeta('property', 'og:site_name', siteName);
    upsertMeta('property', 'og:locale', 'en_US');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', siteTitle);
    upsertMeta('name', 'twitter:description', siteDescription);
    upsertMeta('name', 'twitter:image', ogImage);
    upsertMeta('name', 'twitter:image:alt', 'Talha Tariq - AI Engineer and MERN Developer');

    upsertLink('canonical', canonicalUrl);
    upsertLink('sitemap', sitemapUrl);
    upsertAlternateLink('en', canonicalUrl);
    upsertAlternateLink('x-default', canonicalUrl);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: 'Talha Tariq',
          url: `${siteUrl}/`,
          image: ogImage,
          jobTitle: 'AI Engineer and MERN Web Developer',
          description:
            'AI software engineer and MERN web developer building automation systems, business software, and scalable full-stack web applications.',
          email: 'mailto:tariqtalha772@gmail.com',
          telephone: '+923256525755',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'PK',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'tariqtalha772@gmail.com',
              telephone: '+923256525755',
              availableLanguage: ['en'],
              areaServed: 'Worldwide',
            },
          ],
          sameAs: [
            'https://github.com/Talha-Tariq-772',
            'https://www.linkedin.com/in/talha-tariq-81a85a35a',
            whatsappUrl,
          ],
          knowsAbout: [
            'AI Software',
            'MERN Stack',
            'Business Systems Development',
            'Machine Learning',
            'Deep Learning',
            'Natural Language Processing',
            'Web Application Development',
          ],
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${siteUrl}/#service`,
          name: 'AI and Web Development Services',
          url: `${siteUrl}/`,
          provider: { '@id': `${siteUrl}/#person` },
          description:
            'Professional AI software and MERN web development services for business websites, intelligent systems, and automation workflows.',
          areaServed: 'Worldwide',
          serviceType: [
            'AI Software Development',
            'MERN Web Development',
            'Business System Development',
            'Automation Workflow Development',
            'Backend API Architecture',
          ],
          knowsLanguage: ['English', 'Urdu'],
        },
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: siteTitle,
          description: siteDescription,
          publisher: { '@id': `${siteUrl}/#person` },
          inLanguage: 'en',
        },
        {
          '@type': 'WebPage',
          '@id': `${siteUrl}/#webpage`,
          url: canonicalUrl,
          name: 'Talha Tariq Portfolio',
          description: siteDescription,
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': `${siteUrl}/#person` },
          primaryImageOfPage: ogImage,
        },
        {
          '@type': 'ItemList',
          '@id': `${siteUrl}/#projects`,
          name: 'Featured Web Projects',
          itemListElement: featuredProjects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              name: project.name,
              url: project.url,
              creator: { '@id': `${siteUrl}/#person` },
            },
          })),
        },
      ],
    };

    let script = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
};

export default SEO;

