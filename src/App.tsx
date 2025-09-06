import React, { useState } from 'react';
import { githubService } from './services/githubService';
import { aiService, AIInsights } from './services/aiService';
import { RepositoryAnalysis, APIError } from './types/github';
import RepositorySearch from './components/RepositorySearch';
import Dashboard from './components/Dashboard';
import ErrorDisplay from './components/ErrorDisplay';
import './App.css';

type AppState = 'search' | 'loading' | 'success' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('search');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = async (owner: string, repo: string) => {
    try {
      setAppState('loading');
      setError(null);
      setAnalysis(null);
      setAiInsights(null);

      // Fetch repository analysis
      const repositoryAnalysis = await githubService.getRepositoryAnalysis(owner, repo);
      
      // Ensure we have repository data before proceeding
      if (!repositoryAnalysis.repository) {
        throw new Error('Failed to fetch repository data');
      }
      
      setAnalysis(repositoryAnalysis as RepositoryAnalysis);
      setAppState('success');

      // Generate AI insights if service is available
      if (aiService.isAvailable() && repositoryAnalysis.repository) {
        setAiLoading(true);
        try {
          const insights = await aiService.generateAllInsights(
            repositoryAnalysis.repository,
            repositoryAnalysis.languages,
            repositoryAnalysis.contributors,
            repositoryAnalysis.readme
          );
          setAiInsights(insights);
        } catch (aiError) {
          console.error('Failed to generate AI insights:', aiError);
          // AI failure shouldn't break the app, just log the error
        } finally {
          setAiLoading(false);
        }
      }
    } catch (err) {
      console.error('Error fetching repository:', err);
      setError(err as APIError);
      setAppState('error');
    }
  };

  const handleRetry = () => {
    if (analysis?.repository) {
      const [owner, repo] = analysis.repository.full_name.split('/');
      handleSearch(owner, repo);
    } else {
      setAppState('search');
    }
  };

  const handleBack = () => {
    setAppState('search');
    setAnalysis(null);
    setAiInsights(null);
    setError(null);
  };

  // Render based on current state
  switch (appState) {
    case 'search':
      return (
        <div className="app">
          <div className="app-background">
            <RepositorySearch onSearch={handleSearch} />
          </div>
        </div>
      );

    case 'loading':
      return (
        <div className="app">
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h2 className="loading-title">Analyzing Repository</h2>
              <p className="loading-subtitle">
                Fetching repository data and generating insights...
              </p>
              <div className="loading-steps">
                <div className="loading-step completed">
                  <span className="step-icon">✓</span>
                  <span className="step-text">Connecting to GitHub API</span>
                </div>
                <div className="loading-step active">
                  <span className="step-icon">⟳</span>
                  <span className="step-text">Fetching repository data</span>
                </div>
                <div className="loading-step">
                  <span className="step-icon">○</span>
                  <span className="step-text">Generating AI insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'success':
      return analysis ? (
        <Dashboard 
          analysis={analysis} 
          aiInsights={aiInsights || undefined}
          aiLoading={aiLoading}
        />
      ) : null;

    case 'error':
      return error ? (
        <ErrorDisplay 
          error={error} 
          onRetry={handleRetry} 
          onBack={handleBack}
        />
      ) : null;

    default:
      return null;
  }
}

export default App;
