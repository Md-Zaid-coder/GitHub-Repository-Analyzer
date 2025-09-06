import React from 'react';

export const StatisticsCardSkeleton: React.FC = () => (
  <div className="skeleton-card statistics-card">
    <div className="card-header">
      <div className="repo-info">
        <div className="repo-title">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-text skeleton-meta"></div>
      </div>
      <div className="owner-info">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text skeleton-name"></div>
      </div>
    </div>
    <div className="stats-grid">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="stat-item skeleton-stat">
          <div className="skeleton-icon"></div>
          <div className="stat-content">
            <div className="skeleton-text skeleton-value"></div>
            <div className="skeleton-text skeleton-label"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ title: string }> = ({ title }) => (
  <div className="skeleton-card chart-skeleton">
    <div className="chart-header">
      <div className="skeleton-text skeleton-chart-title">{title}</div>
      <div className="skeleton-text skeleton-chart-subtitle"></div>
    </div>
    <div className="skeleton-chart-container">
      <div className="skeleton-chart"></div>
    </div>
  </div>
);

export const AIInsightsSkeleton: React.FC = () => (
  <div className="skeleton-card ai-insights">
    <div className="insights-header">
      <div className="skeleton-text skeleton-insights-title"></div>
    </div>
    <div className="insights-grid">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="insight-card skeleton-insight">
          <div className="skeleton-text skeleton-insight-title"></div>
          <div className="skeleton-text skeleton-insight-line"></div>
          <div className="skeleton-text skeleton-insight-line"></div>
          <div className="skeleton-text skeleton-insight-line short"></div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="dashboard">
    <div className="dashboard-container">
      <StatisticsCardSkeleton />
      <div className="charts-section">
        <div className="charts-grid">
          <ChartSkeleton title="🎯 Language Composition" />
          <ChartSkeleton title="📈 Commit Activity" />
        </div>
      </div>
      <AIInsightsSkeleton />
    </div>
  </div>
);

export const RepositorySearchSkeleton: React.FC = () => (
  <div className="repository-search">
    <div className="search-header">
      <div className="skeleton-text skeleton-main-title"></div>
      <div className="skeleton-text skeleton-subtitle"></div>
    </div>
    <div className="search-form">
      <div className="input-group">
        <div className="skeleton-input-row">
          <div className="skeleton-input"></div>
          <div className="skeleton-separator"></div>
          <div className="skeleton-input"></div>
        </div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  </div>
);

interface SkeletonLoaderProps {
  type: 'dashboard' | 'search' | 'statistics' | 'chart' | 'insights';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'search':
      return <RepositorySearchSkeleton />;
    case 'statistics':
      return <StatisticsCardSkeleton />;
    case 'chart':
      return <ChartSkeleton title="Loading Chart..." />;
    case 'insights':
      return <AIInsightsSkeleton />;
    default:
      return <div className="skeleton-placeholder">Loading...</div>;
  }
};
