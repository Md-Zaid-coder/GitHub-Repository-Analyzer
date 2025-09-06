import React from 'react';
import { GitHubRepository } from '../types/github';

interface StatisticsCardProps {
  repository: GitHubRepository;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ repository }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = [
    {
      icon: '⭐',
      label: 'Stars',
      value: formatNumber(repository.stargazers_count),
      color: 'text-yellow-600'
    },
    {
      icon: '🍴',
      label: 'Forks',
      value: formatNumber(repository.forks_count),
      color: 'text-blue-600'
    },
    {
      icon: '🐛',
      label: 'Open Issues',
      value: formatNumber(repository.open_issues_count),
      color: 'text-red-600'
    },
    {
      icon: '👥',
      label: 'Watchers',
      value: formatNumber(repository.watchers_count),
      color: 'text-green-600'
    }
  ];

  return (
    <div className="statistics-card">
      <div className="card-header">
        <div className="repo-info">
          <div className="repo-title">
            <a 
              href={repository.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >
              {repository.full_name}
            </a>
            {repository.language && (
              <span className="language-badge">
                {repository.language}
              </span>
            )}
          </div>
          
          {repository.description && (
            <p className="repo-description">
              {repository.description}
            </p>
          )}
          
          <div className="repo-meta">
            <span>Created: {formatDate(repository.created_at)}</span>
            <span>•</span>
            <span>Last updated: {formatDate(repository.updated_at)}</span>
          </div>
        </div>
        
        <div className="owner-info">
          <a 
            href={repository.owner.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="owner-link"
          >
            <img 
              src={repository.owner.avatar_url} 
              alt={repository.owner.login}
              className="owner-avatar"
            />
            <span className="owner-name">{repository.owner.login}</span>
          </a>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className={`stat-value ${stat.color}`}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {repository.license && (
        <div className="license-info">
          <span className="license-icon">📄</span>
          <span className="license-text">
            Licensed under <strong>{repository.license.name}</strong>
          </span>
        </div>
      )}

      <div className="external-links">
        <a 
          href={repository.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <span>📂</span>
          View on GitHub
        </a>
        <a 
          href={`${repository.html_url}/issues`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <span>🐛</span>
          Issues
        </a>
        <a 
          href={`${repository.html_url}/pulls`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          <span>🔀</span>
          Pull Requests
        </a>
      </div>
    </div>
  );
};

export default StatisticsCard;
