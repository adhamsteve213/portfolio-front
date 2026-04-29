import React, { useState } from 'react';
import './Skills.css';

const Skills = ({ language, translations }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('frontend');

  const frontendSkills = [
    { name: 'HTML5', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', color: '#e34f26', bg: 'rgba(227, 79, 38, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'CSS3', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', color: '#1572b6', bg: 'rgba(21, 114, 182, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { name: 'JavaScript', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', color: '#f7df1e', bg: 'rgba(247, 223, 30, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'TypeScript', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', color: '#3178c6', bg: 'rgba(49, 120, 198, 0.1)', link: 'https://www.typescriptlang.org/' },
    { name: 'SASS', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg', color: '#cc6699', bg: 'rgba(204, 102, 153, 0.1)', link: 'https://sass-lang.com/' },
    { name: 'Tailwind CSS', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', link: 'https://tailwindcss.com/' },
    { name: 'Bootstrap', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', color: '#7952b3', bg: 'rgba(121, 82, 179, 0.1)', link: 'https://getbootstrap.com/' },
    { name: 'React.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', color: '#61dafb', bg: 'rgba(97, 218, 251, 0.1)', link: 'https://react.dev/' },
    { name: 'Angular.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg', color: '#dd0031', bg: 'rgba(221, 0, 49, 0.1)', link: 'https://angular.io/' },
    { name: 'Vue.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg', color: '#4fc08d', bg: 'rgba(79, 192, 141, 0.1)', link: 'https://vuejs.org/' },
    { name: 'Next.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', link: 'https://nextjs.org/' },
    { name: 'Nuxt.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg', color: '#00dc82', bg: 'rgba(0, 220, 130, 0.1)', link: 'https://nuxt.com/' },
  ];

  const backendSkills = [
    { name: 'C#', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg', color: '#239120', bg: 'rgba(35, 145, 32, 0.1)', link: 'https://docs.microsoft.com/en-us/dotnet/csharp/' },
    { name: 'ASP.NET', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg', color: '#512bd4', bg: 'rgba(81, 43, 212, 0.1)', link: 'https://dotnet.microsoft.com/apps/aspnet' },
    { name: 'SQL', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', color: '#4479a1', bg: 'rgba(68, 121, 161, 0.1)', link: 'https://en.wikipedia.org/wiki/SQL' },
    { name: 'Python', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', color: '#3776ab', bg: 'rgba(55, 118, 171, 0.1)', link: 'https://www.python.org/' },
    { name: 'Django', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', color: '#092e20', bg: 'rgba(9, 46, 32, 0.3)', link: 'https://www.djangoproject.com/' },
    { name: 'PHP', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg', color: '#777bb4', bg: 'rgba(119, 123, 180, 0.1)', link: 'https://www.php.net/' },
    { name: 'Laravel', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg', color: '#ff2d20', bg: 'rgba(255, 45, 32, 0.1)', link: 'https://laravel.com/' },
    { name: 'Node.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', color: '#339933', bg: 'rgba(51, 153, 51, 0.1)', link: 'https://nodejs.org/' },
    { name: 'Express.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', link: 'https://expressjs.com/' },
    { name: 'MongoDB', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', color: '#47a248', bg: 'rgba(71, 162, 72, 0.1)', link: 'https://www.mongodb.com/' },
    { name: 'Java', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', color: '#007396', bg: 'rgba(0, 115, 150, 0.1)', link: 'https://www.java.com/' },
    { name: 'Spring Boot', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', color: '#6db33f', bg: 'rgba(109, 179, 63, 0.1)', link: 'https://spring.io/projects/spring-boot' },
  ];

  const otherSkills = [
    { name: 'Git', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', color: '#f05032', bg: 'rgba(240, 80, 50, 0.1)', link: 'https://git-scm.com/' },
    { name: 'Docker', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', color: '#2496ed', bg: 'rgba(36, 150, 237, 0.1)', link: 'https://www.docker.com/' },
    { name: 'CI/CD', icon: 'fas fa-sync', color: '#2088ff', bg: 'rgba(32, 136, 255, 0.1)', link: 'https://en.wikipedia.org/wiki/CI/CD' },
    { name: 'System Design', icon: 'fas fa-project-diagram', color: '#e535ab', bg: 'rgba(229, 53, 171, 0.1)', link: '#' },
    { name: 'AWS', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', color: '#ff9900', bg: 'rgba(255, 153, 0, 0.1)', link: 'https://aws.amazon.com/' },
    { name: 'Azure', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg', color: '#0089d6', bg: 'rgba(0, 137, 214, 0.1)', link: 'https://azure.microsoft.com/' },
    { name: 'Excel', icon: 'fas fa-file-excel', color: '#217346', bg: 'rgba(33, 115, 70, 0.1)', link: 'https://www.microsoft.com/en-us/microsoft-365/excel' },
    { name: 'Google Sheets', icon: 'fas fa-file-csv', color: '#34a853', bg: 'rgba(52, 168, 83, 0.1)', link: 'https://www.google.com/sheets/about/' },
    { name: 'AI Automation', icon: 'fas fa-robot', color: '#ff6600', bg: 'rgba(255, 102, 0, 0.1)', link: 'https://n8n.io/' },
    { name: 'UI/UX', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', color: '#f24e1e', bg: 'rgba(242, 78, 30, 0.1)', link: 'https://www.figma.com/' },
    { name: 'ATS Skills', icon: 'fas fa-file-alt', color: '#888888', bg: 'rgba(136, 136, 136, 0.1)', link: '#' },
  ];

  const skills = activeTab === 'frontend' ? frontendSkills : activeTab === 'backend' ? backendSkills : otherSkills;

  return (
    <section id="skills" className={`skills ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.skillsTag}</span>
          <h2 className="section-title">{t.skillsTitle}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t.skillsSubtitle}</p>
        </div>

        <div className="skills-tabs">
          <button
            className={`tab-btn ${activeTab === 'frontend' ? 'active' : ''}`}
            onClick={() => setActiveTab('frontend')}
          >
            <i className="fas fa-palette"></i>
            {t.frontend}
            <span className="tab-count">{frontendSkills.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <i className="fas fa-server"></i>
            {t.backend}
            <span className="tab-count">{backendSkills.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            <i className="fas fa-tools"></i>
            {t.otherSkills}
            <span className="tab-count">{otherSkills.length}</span>
          </button>
        </div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <a
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="skill-card"
              key={skill.name}
              style={{
                '--skill-color': skill.color,
                '--skill-bg': skill.bg,
                '--delay': `${index * 0.1}s`
              }}
            >
              <div className="skill-icon">
                {skill.image ? (
                  <img src={skill.image} alt={skill.name} style={{ width: '40px', height: '40px', objectFit: 'contain', filter: skill.image.includes('FFFFFF') ? 'drop-shadow(0 0 2px rgba(255,255,255,0.4))' : 'none' }} />
                ) : (
                  <i className={skill.icon}></i>
                )}
              </div>
              <div className="skill-glow"></div>
              <h3 className="skill-name">{skill.name}</h3>
              <div className="skill-3d-effect"></div>
            </a>
          ))}
        </div>

        <div className="skills-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
          <div className="deco-circle deco-3"></div>
        </div>
      </div>
      <div className="section-number">03</div>
    </section>
  );
};

export default Skills;
