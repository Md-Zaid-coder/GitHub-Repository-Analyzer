import React from 'react';
import { AIInsights as AIInsightsType } from '../services/aiService';


interface AIInsightsProps {
  insights: AIInsightsType;
  loading?: boolean;
}


const AIInsights: React.FC<AIInsightsProps> = ({ insights, loading = false }) => {
  const insightCards = [
    {
      id: 'repository-summary',
      icon: '🤖',
      title: 'AI Repository Summary',
      content: insights.repositorySummary,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'language-analysis',
      icon: '🔍',
      title: 'AI Language Analysis',
      content: insights.languageAnalysis,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'contribution-patterns',
      icon: '👥',
      title: 'AI Contribution Patterns',
      content: insights.contributionPatterns,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600'
    }
  ];


  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          AI-Powered Insights
        </h2>
        <p className="section-subtitle">
          Intelligent analysis powered by Google Gemini
        </p>
      </div>


      <div className="insights-grid">
        {insightCards.map((card) => (
          <div key={card.id} className={`insight-card ${card.bgColor} ${card.borderColor}`}>
            <div className="card-header">
              <div className={`card-icon ${card.iconColor}`}>
                {card.icon}
              </div>
              <h3 className="card-title">{card.title}</h3>
            </div>


            <div className="card-content">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-shimmer"></div>
                  <div className="loading-shimmer"></div>
                  <div className="loading-shimmer short"></div>
                </div>
              ) : (
                <p className="insight-text">
                  {card.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>


      {!loading && (
        <div className="ai-disclaimer">
          <div className="disclaimer-icon">ℹ️</div>
          <div className="disclaimer-content">
            <p className="disclaimer-text">
              <strong>AI-Generated Content:</strong> These insights are automatically generated 
              using AI and should be considered as supplementary information. Results may vary 
              based on available repository data.
            </p>
          </div>
        </div>
      )}


    </div>
  );
};


export default AIInsights;
