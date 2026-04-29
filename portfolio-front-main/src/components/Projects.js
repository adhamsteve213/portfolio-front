import React, { useState, useEffect } from 'react';
import './Projects.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-back-main-tzmdch.laravel.cloud/api';

const normalizeSamples = (folder) => {
  const rawSamples = folder.work_samples || folder.workSamples || [];

  return rawSamples.map((sample) => ({
    id: sample.id,
    project_name: sample.project_name || sample.projectName || 'Untitled Project',
    description: sample.description || '',
    image_url: sample.image_url || sample.imageUrl || '',
    is_cover: Boolean(sample.is_cover ?? sample.isCover),
  })).filter((sample) => sample.image_url);
};

const pickRandomSample = (samples) => {
  if (!samples.length) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * samples.length);
  return samples[randomIndex];
};

const normalizeFolder = (folder) => {
  const samples = normalizeSamples(folder);
  const randomSample = pickRandomSample(samples);
  const coverSample = samples.find((sample) => sample.is_cover);
  const thumbnail = randomSample?.image_url || folder.thumbnail_url || folder.thumbnailUrl || coverSample?.image_url || samples[0]?.image_url || '';

  return {
    id: folder.id,
    name: folder.name || 'Untitled Folder',
    description: folder.description || '',
    thumbnail,
    samples,
  };
};

const Projects = ({ language, translations }) => {
  const t = translations[language];

  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [openFolder, setOpenFolder] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch folders and work samples from backend API
  useEffect(() => {
    let isMounted = true;

    const loadFolders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio/folders`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const normalizedFolders = Array.isArray(data) ? data.map(normalizeFolder) : [];

        if (isMounted) {
          setFolders(normalizedFolders);
          setLoadError('');
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Unable to load portfolio data right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFolders();

    return () => {
      isMounted = false;
    };
  }, []);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = openFolder ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openFolder]);

  const handleOpenFolder = (folder) => {
    setOpenFolder(folder);
    setActiveIndex(0);
  };

  const currentSample = openFolder?.samples[activeIndex] || null;

  const nextSample = () => {
    if (!openFolder || openFolder.samples.length === 0) {
      return;
    }

    setActiveIndex((index) => (index + 1) % openFolder.samples.length);
  };

  const prevSample = () => {
    if (!openFolder || openFolder.samples.length === 0) {
      return;
    }

    setActiveIndex((index) => (index - 1 + openFolder.samples.length) % openFolder.samples.length);
  };

  return (
    <section id="portfolio" className={`projects ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t?.projectsTag || 'Portfolio'}</span>
          <h2 className="section-title">{t?.projectsTitle || 'My Projects'}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t?.projectsSubtitle || 'A collection of my recent work in food photography.'}</p>
        </div>

        <div className="projects-grid">
          {isLoading && (
            <div className="folder-card">
              <div className="folder-card-info">
                <h3>{t?.loading || 'Loading portfolio...'}</h3>
              </div>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="folder-card">
              <div className="folder-card-info">
                <h3>{loadError}</h3>
              </div>
            </div>
          )}

          {!isLoading && !loadError && folders.map(folder => (
            <div key={folder.id} className="folder-card" onClick={() => handleOpenFolder(folder)}>
              <div className="folder-card-thumb">
                {folder.thumbnail ? (
                  <>
                    <img src={folder.thumbnail} alt={folder.name} />
                    <div className="folder-card-overlay">
                      <i className="fas fa-search-plus"></i>
                      <span>{folder.samples.length} {t?.images || 'Images'}</span>
                    </div>
                  </>
                ) : (
                  <div className="folder-card-placeholder">
                    <i className="fas fa-folder"></i>
                    <span>{t?.emptyFolder || 'Empty Folder'}</span>
                  </div>
                )}
              </div>
              <div className="folder-card-info">
                <h3>{folder.name}</h3>
                {folder.description && <p>{folder.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ OPEN FOLDER — Image Gallery (Full Page Overlay) ═══════ */}
      {openFolder && (
        <div className="folder-full-page" onClick={() => setOpenFolder(null)}>
          <div className={`folder-page-content ${language === 'ar' ? 'rtl' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="folder-header sticky-header">
              <div className="folder-header-left">
                <button className="folder-back-btn" onClick={() => setOpenFolder(null)}>
                  <i className={`fas fa-arrow-${language === 'ar' ? 'right' : 'left'}`}></i>
                </button>
                <i className="fas fa-folder-open folder-header-icon"></i>
                <div className="folder-title-wrap">
                  <h3>{openFolder.name}</h3>
                  {openFolder.description && <p>{openFolder.description}</p>}
                </div>
              </div>
              <div className="folder-header-right">
                <button className="folder-close-btn" onClick={() => setOpenFolder(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div className="folder-body full-width">
              {openFolder.samples.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-images"></i>
                  <p>{t?.noImages || 'No Images'}</p>
                </div>
              ) : (
                <div className="folder-slider-layout">
                  <div className="slider-left-panel">
                    <div className="slider-main-image-wrap">
                      <img src={currentSample?.image_url} alt={currentSample?.project_name || openFolder.name} loading="lazy" />

                      {openFolder.samples.length > 1 && (
                        <>
                          <button className="slider-arrow slider-arrow-left" onClick={prevSample} aria-label="Previous image">
                            <i className="fas fa-chevron-left"></i>
                          </button>

                          <button className="slider-arrow slider-arrow-right" onClick={nextSample} aria-label="Next image">
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </>
                      )}
                    </div>

                    {openFolder.samples.length > 1 && (
                      <div className="slider-thumbs-row">
                        {openFolder.samples.map((sample, idx) => (
                          <button
                            key={sample.id || idx}
                            type="button"
                            className={`slider-thumb-btn ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Show image ${idx + 1}`}
                          >
                            <img src={sample.image_url} alt={sample.project_name} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="slider-right-panel">
                    <div className="project-meta-block">
                      <span className="meta-label">Project</span>
                      <h4>{currentSample?.project_name || 'Untitled Project'}</h4>
                      <p>{currentSample?.description || 'No description available yet.'}</p>
                    </div>

                    <div className="project-count-block">
                      <span>{activeIndex + 1} / {openFolder.samples.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="section-number">04</div>
    </section>
  );
};

export default Projects;
