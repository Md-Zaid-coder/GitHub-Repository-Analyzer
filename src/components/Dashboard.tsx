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
}

const Dashboard: React.FC<DashboardProps> = ({ 
  analysis, 
  aiInsights, 
  aiLoading = false 
}) => {
  if (!analysis.repository) {
    return null;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Demo Mode Notification */}
        <div className="demo-notification">
          <div className="demo-icon">🔄</div>
          <div className="demo-content">
            <p><strong>Demo Mode Active:</strong> Using cached/sample data due to network connectivity. The app is fully functional for demonstration purposes.</p>
          </div>
        </div>
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
