import React, { useState } from 'react';
import { RepositoryAnalysis } from '../types/github';
import StatisticsCard from './StatisticsCard';
import LanguageChart from './LanguageChart';
import CommitActivityChart from './CommitActivityChart';

interface RepositoryComparisonProps {
  repositories: RepositoryAnalysis[];
  onRemoveRepository: (index: number) => void;
  onClose: () => void;
}

const RepositoryComparison: React.FC<RepositoryComparisonProps> = ({ 
  repositories, 
  onRemoveRepository, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'activity'>('overview');

  const getComparisonData = () => {
    if (repositories.length < 2) return null;

    const [repo1, repo2] = repositories;
    
    return {
      stars: {
        repo1: repo1.repository.stargazers_count,
        repo2: repo2.repository.stargazers_count,
        winner: repo1.repository.stargazers_count > repo2.repository.stargazers_count ? 0 : 1
      },
      forks: {
        repo1: repo1.repository.forks_count,
        repo2: repo2.repository.forks_count,
        winner: repo1.repository.forks_count > repo2.repository.forks_count ? 0 : 1
      },
      issues: {
        repo1: repo1.repository.open_issues_count,
        repo2: repo2.repository.open_issues_count,
        winner: repo1.repository.open_issues_count < repo2.repository.open_issues_count ? 0 : 1 // Lower is better
      },
      size: {
        repo1: repo1.repository.size,
        repo2: repo2.repository.size,
        winner: repo1.repository.size < repo2.repository.size ? 0 : 1 // Smaller is better
      },
      languages: {
        repo1: Object.keys(repo1.languages).length,
        repo2: Object.keys(repo2.languages).length,
        winner: Object.keys(repo1.languages).length > Object.keys(repo2.languages).length ? 0 : 1
      },
      contributors: {
        repo1: repo1.contributors.length,
        repo2: repo2.contributors.length,
        winner: repo1.contributors.length > repo2.contributors.length ? 0 : 1
      }
    };
  };

  const comparisonData = getComparisonData();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const renderComparisonMetric = (
    label: string,
    value1: number,
    value2: number,
    winner: number,
    formatter: (n: number) => string = formatNumber
  ) => (
    <div className="comparison-metric">
      <div className="metric-label">{label}</div>
      <div className="metric-values">
        <div className={`metric-value ${winner === 0 ? 'winner' : ''}`}>
          {formatter(value1)}
        </div>
        <div className="vs-divider">vs</div>
        <div className={`metric-value ${winner === 1 ? 'winner' : ''}`}>
          {formatter(value2)}
        </div>
      </div>
    </div>
  );

  if (repositories.length < 2) {
    return (
      <div className="comparison-error">
        <h2>Repository Comparison</h2>
        <p>You need at least 2 repositories to compare. Please analyze more repositories first.</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    );
  }

  return (
    <div className="repository-comparison">
      <div className="comparison-header">
        <h2 className="comparison-title">
          <span className="comparison-icon">⚖️</span>
          Repository Comparison
        </h2>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>

      <div className="comparison-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          🎯 Languages
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Activity
        </button>
      </div>

      <div className="comparison-content">
        {activeTab === 'overview' && (
          <>
            <div className="repository-headers">
              <div className="repo-header">
                <h3>{repositories[0].repository.full_name}</h3>
                <p>{repositories[0].repository.description}</p>
                <button 
                  onClick={() => onRemoveRepository(0)}
                  className="remove-repo-button"
                >
                  Remove
                </button>
              </div>
              <div className="repo-header">
                <h3>{repositories[1].repository.full_name}</h3>
                <p>{repositories[1].repository.description}</p>
                <button 
                  onClick={() => onRemoveRepository(1)}
                  className="remove-repo-button"
                >
                  Remove
                </button>
              </div>
            </div>

            {comparisonData && (
              <div className="comparison-metrics">
                {renderComparisonMetric('Stars', comparisonData.stars.repo1, comparisonData.stars.repo2, comparisonData.stars.winner)}
                {renderComparisonMetric('Forks', comparisonData.forks.repo1, comparisonData.forks.repo2, comparisonData.forks.winner)}
                {renderComparisonMetric('Open Issues', comparisonData.issues.repo1, comparisonData.issues.repo2, comparisonData.issues.winner)}
                {renderComparisonMetric('Contributors', comparisonData.contributors.repo1, comparisonData.contributors.repo2, comparisonData.contributors.winner)}
                {renderComparisonMetric('Languages', comparisonData.languages.repo1, comparisonData.languages.repo2, comparisonData.languages.winner, (n) => n.toString())}
                {renderComparisonMetric('Size (KB)', comparisonData.size.repo1, comparisonData.size.repo2, comparisonData.size.winner)}
              </div>
            )}
          </>
        )}

        {activeTab === 'languages' && (
          <div className="comparison-charts">
            <div className="comparison-chart">
              <h4>{repositories[0].repository.full_name}</h4>
              <LanguageChart languages={repositories[0].languages} />
            </div>
            <div className="comparison-chart">
              <h4>{repositories[1].repository.full_name}</h4>
              <LanguageChart languages={repositories[1].languages} />
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="comparison-charts">
            <div className="comparison-chart">
              <h4>{repositories[0].repository.full_name}</h4>
              <CommitActivityChart commitActivity={repositories[0].commitActivity} />
            </div>
            <div className="comparison-chart">
              <h4>{repositories[1].repository.full_name}</h4>
              <CommitActivityChart commitActivity={repositories[1].commitActivity} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryComparison;
