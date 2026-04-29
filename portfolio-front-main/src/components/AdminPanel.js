import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminPanel.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-back-main-tzmdch.laravel.cloud/api';
const TOKEN_KEY = 'portfolio_admin_token';

const convertFileToJpeg = async (file) => {
  // Keep JPEGs as-is to avoid unnecessary recompression.
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    return file;
  }

  try {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const context = canvas.getContext('2d');
    if (!context) {
      URL.revokeObjectURL(imageUrl);
      return file;
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);

    const convertedBlob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });

    URL.revokeObjectURL(imageUrl);

    if (!convertedBlob) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([convertedBlob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch (error) {
    return file;
  }
};

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [statusMessage, setStatusMessage] = useState('');

  const [folders, setFolders] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');

  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [images, setImages] = useState([]);

  const selectedFolder = useMemo(() => {
    return folders.find((folder) => String(folder.id) === String(selectedFolderId)) || null;
  }, [folders, selectedFolderId]);

  const selectedFolderSamples = useMemo(() => {
    if (!selectedFolder) {
      return [];
    }

    return selectedFolder.work_samples || selectedFolder.workSamples || [];
  }, [selectedFolder]);

  const canSubmitUpload = useMemo(() => {
    return selectedFolderId && projectName.trim() && images.length > 0;
  }, [selectedFolderId, projectName, images]);

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }), [token]);

  const loadFolders = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoadingFolders(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/folders`, {
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error('Failed to load folders.');
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data : [];
      setFolders(normalized);

      if (normalized.length > 0 && !selectedFolderId) {
        setSelectedFolderId(String(normalized[0].id));
      }
    } catch (error) {
      setStatusMessage('Could not load folders. Please login again.');
    } finally {
      setIsLoadingFolders(false);
    }
  }, [authHeaders, selectedFolderId, token]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setStatusMessage('Logging in...');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setStatusMessage('Login successful. You can now add folders and projects.');
    } catch (error) {
      setStatusMessage(error.message || 'Login failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        headers: authHeaders,
      });
    } catch (error) {
      // Ignore logout request errors and clear local state regardless.
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setFolders([]);
    setSelectedFolderId('');
    setStatusMessage('Logged out.');
  };

  const handleCreateFolder = async (event) => {
    event.preventDefault();

    if (!folderName.trim()) {
      setStatusMessage('Folder name is required.');
      return;
    }

    setStatusMessage('Creating folder...');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/folders`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName.trim(),
          description: folderDescription.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Folder creation failed.');
      }

      setFolderName('');
      setFolderDescription('');
      setSelectedFolderId(String(data.id));
      setStatusMessage('Folder created successfully.');
      await loadFolders();
    } catch (error) {
      setStatusMessage(error.message || 'Folder creation failed.');
    }
  };

  const handleUploadImages = async (event) => {
    event.preventDefault();

    if (!canSubmitUpload) {
      setStatusMessage('Please choose a folder, project name, and at least one image.');
      return;
    }

    setStatusMessage('Uploading images...');

    const normalizedImages = await Promise.all(images.map((file) => convertFileToJpeg(file)));

    const formData = new FormData();
    formData.append('project_name', projectName.trim());

    if (projectDescription.trim()) {
      formData.append('description', projectDescription.trim());
    }

    normalizedImages.forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/folders/${selectedFolderId}/samples`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      const rawBody = await response.text();
      let data = {};

      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch (parseError) {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Upload failed: image size is too large for the server limit.');
        }

        const validationErrors = data.errors ? Object.values(data.errors).flat() : [];
        const firstValidationError = validationErrors[0];
        throw new Error(firstValidationError || data.message || 'Upload failed.');
      }

      setProjectName('');
      setProjectDescription('');
      setImages([]);
      setStatusMessage('Images uploaded successfully.');
      await loadFolders();
    } catch (error) {
      setStatusMessage(error.message || 'Upload failed.');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const confirmed = window.confirm('Delete this folder and all of its project samples?');

    if (!confirmed) {
      return;
    }

    setStatusMessage('Deleting folder...');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/folders/${folderId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Folder deletion failed.');
      }

      if (String(folderId) === String(selectedFolderId)) {
        setSelectedFolderId('');
      }

      setStatusMessage('Folder deleted successfully.');
      await loadFolders();
    } catch (error) {
      setStatusMessage(error.message || 'Folder deletion failed.');
    }
  };

  const handleDeleteSample = async (sampleId) => {
    const confirmed = window.confirm('Delete this project sample image?');

    if (!confirmed) {
      return;
    }

    setStatusMessage('Deleting sample...');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/samples/${sampleId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sample deletion failed.');
      }

      setStatusMessage('Sample deleted successfully.');
      await loadFolders();
    } catch (error) {
      setStatusMessage(error.message || 'Sample deletion failed.');
    }
  };

  if (!token) {
    return (
      <main className="admin-page">
        <section className="admin-card auth-card">
          <h1>Admin Login</h1>
          <p>Use your backend admin email and password to manage folders and projects.</p>

          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="admin@portfolio.test"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter password"
              />
            </label>

            <button type="submit">Login</button>
          </form>

          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-card admin-header-card">
        <div>
          <h1>Portfolio Admin</h1>
          <p>Create folders and upload project images (PNG/JPEG only).</p>
          <p className="cover-tip">Tip: upload one image named cover.jpg or cover.png to use it as folder thumbnail.</p>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <h2>Create Folder</h2>
          <form onSubmit={handleCreateFolder} className="admin-form">
            <label>
              Folder Name (required)
              <input
                type="text"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                required
                placeholder="Food Campaigns"
              />
            </label>

            <label>
              Folder Description (optional)
              <textarea
                value={folderDescription}
                onChange={(event) => setFolderDescription(event.target.value)}
                rows={4}
                placeholder="Short description"
              />
            </label>

            <button type="submit">Create Folder</button>
          </form>
        </article>

        <article className="admin-card">
          <h2>Add Project Images</h2>
          <form onSubmit={handleUploadImages} className="admin-form">
            <label>
              Folder
              <select
                value={selectedFolderId}
                onChange={(event) => setSelectedFolderId(event.target.value)}
                required
              >
                <option value="" disabled>Select folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </label>

            <label>
              Project Name (required)
              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                required
                placeholder="Burger Promo Shoot"
              />
            </label>

            <label>
              Project Description (optional)
              <textarea
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                rows={4}
                placeholder="Project details"
              />
            </label>

            <label>
              Images (any image format, multiple allowed)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  setImages(files);
                }}
                required
              />
            </label>

            <button type="submit" disabled={!canSubmitUpload}>Upload Images</button>
          </form>
        </article>
      </section>

      <section className="admin-card">
        <h2>Your Folders</h2>
        {isLoadingFolders ? (
          <p>Loading folders...</p>
        ) : folders.length === 0 ? (
          <p>No folders yet.</p>
        ) : (
          <div className="folders-list">
            {folders.map((folder) => (
              <div key={folder.id} className="folder-row">
                <div>
                  <strong>{folder.name}</strong>
                  <p>{folder.description || 'No description'}</p>
                </div>
                <div className="folder-row-actions">
                  <span>{folder.work_samples_count || 0} images</span>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    Delete Folder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </section>

      <section className="admin-card">
        <h2>Project Samples In Selected Folder</h2>

        {!selectedFolderId ? (
          <p>Select a folder to manage its samples.</p>
        ) : isLoadingFolders ? (
          <p>Loading samples...</p>
        ) : selectedFolderSamples.length === 0 ? (
          <p>No samples in this folder yet.</p>
        ) : (
          <div className="samples-list">
            {selectedFolderSamples.map((sample) => (
              <div key={sample.id} className="sample-row">
                <div className="sample-preview">
                  <img src={sample.image_url || sample.imageUrl} alt={sample.project_name || sample.projectName} />
                </div>

                <div className="sample-meta">
                  <strong>{sample.project_name || sample.projectName || 'Untitled Project'}</strong>
                  <p>{sample.description || 'No description'}</p>
                </div>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => handleDeleteSample(sample.id)}
                >
                  Delete Sample
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminPanel;
