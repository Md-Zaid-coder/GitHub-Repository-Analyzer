import React from 'react';
import { RepositoryAnalysis } from '../types/github';
import { AIInsights as AIInsightsType } from '../services/aiService';
import StatisticsCard from './StatisticsCard';
import LanguageChart from './LanguageChart';
import CommitActivityChart from './CommitActivityChart';
import AIInsights from './AIInsights';

interface DashboardProps {
  analysis: RepositoryAnalysis;
  aiInsights?: AIInsightsType;
  aiLoading?: boolean;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  analysis, 
  aiInsights, 
  aiLoading = false,
  onBack
}) => {
  if (!analysis.repository) {
    return null;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Back Button */}
        {onBack && (
          <div className="dashboard-header">
            <button onClick={onBack} className="back-to-search-button">
              <span className="back-arrow">←</span>
              <span>Back to Search</span>
            </button>
          </div>
        )}
        
        {/* Repository Overview */}
        <StatisticsCard repository={analysis.repository} />

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-grid">
            <LanguageChart languages={analysis.languages} />
            <CommitActivityChart commitActivity={analysis.commitActivity} />
          </div>
        </div>

        {/* AI Insights Section */}
        {(aiInsights || aiLoading) && (
          <AIInsights 
            insights={aiInsights || {
              repositorySummary: '',
              languageAnalysis: '',
              contributionPatterns: ''
            }} 
            loading={aiLoading}
          />
        )}

        {/* Back to Search Button */}
        <div className="dashboard-footer">
          <button 
            onClick={() => window.location.reload()} 
            className="back-button"
          >
            <span className="back-icon">🔍</span>
            Analyze Another Repository
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
