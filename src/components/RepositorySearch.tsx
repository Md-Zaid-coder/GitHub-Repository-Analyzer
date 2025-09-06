import React, { useState } from 'react';

interface RepositorySearchProps {
  onSearch: (owner: string, repo: string) => void;
  loading?: boolean;
}

const RepositorySearch: React.FC<RepositorySearchProps> = ({ onSearch, loading = false }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!owner.trim() || !repo.trim()) {
      setError('Please enter both repository owner and name');
      return;
    }

    // Clean inputs
    const cleanOwner = owner.trim();
    const cleanRepo = repo.trim();

    // Handle URL input (e.g., https://github.com/owner/repo)
    if (cleanOwner.includes('/') || cleanRepo.includes('/')) {
      const fullInput = `${cleanOwner}/${cleanRepo}`;
      const match = fullInput.match(/github\.com\/([^/]+)\/([^/?#]+)/);
      
      if (match) {
        onSearch(match[1], match[2]);
      } else {
        // Try to parse as owner/repo format
        const parts = fullInput.split('/').filter(Boolean);
        if (parts.length >= 2) {
          onSearch(parts[parts.length - 2], parts[parts.length - 1]);
        } else {
          setError('Invalid repository format. Use "owner/repository" or GitHub URL');
        }
      }
    } else {
      onSearch(cleanOwner, cleanRepo);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) setError('');
    };

  const populateExample = () => {
    setOwner('facebook');
    setRepo('react');
    setError('');
  };

  return (
    <div className="repository-search">
      <div className="search-header">
        <h1>🔍 GitHub Repository Analyzer</h1>
        <p>Enter a repository to get comprehensive insights with AI-powered analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <div className="input-row">
            <input
              type="text"
              placeholder="Repository owner (e.g., facebook)"
              value={owner}
              onChange={handleInputChange(setOwner)}
              disabled={loading}
              className="input-field"
            />
            <span className="separator">/</span>
            <input
              type="text"
              placeholder="Repository name (e.g., react)"
              value={repo}
              onChange={handleInputChange(setRepo)}
              disabled={loading}
              className="input-field"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !owner.trim() || !repo.trim()}
            className="search-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Repository'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="helper-text">
          <p>
            💡 You can enter: <strong>owner/repo</strong> or paste a full GitHub URL
          </p>
          <button 
            type="button" 
            onClick={populateExample}
            className="example-button"
            disabled={loading}
          >
            Try example: facebook/react
          </button>
        </div>
      </form>
    </div>
  );
};

export default RepositorySearch;
